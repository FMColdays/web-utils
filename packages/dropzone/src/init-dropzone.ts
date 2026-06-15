import { EXT_TO_MIME } from '@/const'
import { parseOptions, createZone, createPreviewItem, uploadFile, captureGeolocation } from '@/utils'

/**
 * Inicializa un único contenedor `[data-dropzone]`: crea la zona visual, la
 * lista de previews, y enlaza drag & drop, selección, validación, eliminación
 * y (si hay `data-url`) subida inmediata. Idempotente (marca `data-dz-init`).
 */
export function initDropzone(container: HTMLElement): void {
  const input = container.querySelector<HTMLInputElement>('[data-dropzone-files]')
  if (!input || container.dataset.dzInit === '1') return
  container.dataset.dzInit = '1'

  const opts = parseOptions(container)
  const validMimes = new Set(
    opts.acceptedFiles.map(e => EXT_TO_MIME[e.replace('.', '')] ?? '').filter(Boolean),
  )
  const extRegex = new RegExp(`(${opts.acceptedFiles.map(e => e.replace('.', '\\.')).join('|')})$`, 'i')

  input.accept = opts.acceptedFiles.join(',')
  if (opts.maxFiles > 1) input.multiple = true

  const { zone, labelText } = createZone(opts)
  const previewList = document.createElement('div')
  previewList.className = 'dz-preview-list mt-2 flex flex-wrap gap-2 items-start'

  container.insertBefore(zone, input)
  container.insertBefore(previewList, input)

  let selectedFiles: File[] = []

  const syncInput = (): void => {
    const dt = new DataTransfer()
    selectedFiles.forEach(f => dt.items.add(f))
    input.files = dt.files
  }

  const refreshZone = (): void => {
    const full = selectedFiles.length >= opts.maxFiles
    zone.classList.toggle('opacity-50', full)
    zone.classList.toggle('pointer-events-none', full)
    labelText.textContent =
      selectedFiles.length > 0
        ? `${selectedFiles.length} archivo${selectedFiles.length !== 1 ? 's' : ''} seleccionado${selectedFiles.length !== 1 ? 's' : ''}`
        : opts.label
  }

  const removeAt = (index: number): void => {
    selectedFiles.splice(index, 1)
    previewList.children[index]?.remove()
    Array.from(previewList.children).forEach((child, i) => {
      const btn = child.querySelector<HTMLButtonElement>('.dz-remove')
      if (btn) {
        const clone = btn.cloneNode(true) as HTMLButtonElement
        clone.addEventListener('click', e => {
          e.preventDefault()
          e.stopPropagation()
          removeAt(i)
        })
        btn.replaceWith(clone)
      }
    })
    syncInput()
    refreshZone()
  }

  const addFile = (file: File): ReturnType<typeof createPreviewItem>['setStatus'] | null => {
    if (selectedFiles.length >= opts.maxFiles) return null
    const index = selectedFiles.length
    selectedFiles.push(file)
    const { el, setStatus } = createPreviewItem(file, () => removeAt(index))
    previewList.appendChild(el)
    syncInput()
    refreshZone()
    return setStatus
  }

  const handleFiles = (files: FileList | File[]): void => {
    const available = opts.maxFiles - selectedFiles.length
    if (available <= 0) return

    let added = false

    Array.from(files)
      .slice(0, available)
      .forEach(file => {
        if (!validMimes.has(file.type) && !extRegex.test(file.name)) {
          labelText.textContent = 'Formato no válido'
          return
        }
        if (file.size > opts.maxFilesize * 1024 * 1024) {
          labelText.textContent = 'Archivo muy grande'
          return
        }
        const setStatus = addFile(file)
        if (setStatus) {
          added = true
          if (opts.uploadUrl) {
            uploadFile(file, opts.uploadParam ?? input.name ?? 'file', opts, setStatus, container)
          }
        }
      })

    // Al agregar archivo(s), capturar la ubicación si se configuró data-geo-lat/lng.
    if (added) captureGeolocation(opts, container)
  }

  zone.addEventListener('click', () => input.click())

  const prevent = (e: Event): void => {
    e.preventDefault()
    e.stopPropagation()
  }

  const isItemValid = (item: DataTransferItem): boolean => {
    // Durante dragover solo tenemos acceso al tipo MIME.
    if (item.kind === 'file') {
      if (!item.type) return true // tipo vacío → asumimos válido (mejor UX)
      return validMimes.has(item.type)
    }
    return false
  }

  ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(ev => zone.addEventListener(ev, prevent))
  ;['dragenter', 'dragover'].forEach(ev =>
    zone.addEventListener(ev, (e: Event) => {
      if (zone.classList.contains('pointer-events-none')) return

      const dragEvent = e as DragEvent
      const items = dragEvent.dataTransfer?.items
      let allValid = true

      if (items && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          if (!isItemValid(items[i])) {
            allValid = false
            break
          }
        }

        if (!allValid) {
          zone.classList.add('bg-linear-to-b', 'from-red-50', 'to-red-100', 'border-red-500')
          zone.classList.remove('from-purple-50', 'to-purple-100', 'border-primary')
          zone.style.borderColor = '#ef4444'
          zone.style.backgroundColor = '#fee2e2'
        } else {
          zone.classList.add('bg-linear-to-b', 'from-purple-50', 'to-purple-100', 'border-primary')
          zone.classList.remove('from-red-50', 'to-red-100', 'border-red-500')
          zone.style.borderColor = ''
          zone.style.backgroundColor = ''
        }
      }
    }),
  )
  ;['dragleave', 'drop'].forEach(ev =>
    zone.addEventListener(ev, () => {
      zone.classList.remove(
        'bg-linear-to-b',
        'from-purple-50',
        'to-purple-100',
        'border-primary',
        'from-red-50',
        'to-red-100',
        'border-red-500',
      )
      zone.style.borderColor = ''
      zone.style.backgroundColor = ''
    }),
  )
  zone.addEventListener('drop', (e: Event) => {
    const dragEvent = e as DragEvent
    if (dragEvent.dataTransfer?.files.length) handleFiles(dragEvent.dataTransfer.files)
  })

  input.addEventListener('change', () => {
    if (input.files?.length) {
      const files = Array.from(input.files) // capturar antes del reset
      input.value = '' // reset para poder re-seleccionar el mismo archivo
      handleFiles(files) // syncInput() re-setea los archivos vía DataTransfer
    }
    // Siempre restaurar los archivos vía DataTransfer: algunos browsers (Safari)
    // disparan 'change' con files vacío al cancelar el picker.
    syncInput()
  })
}
