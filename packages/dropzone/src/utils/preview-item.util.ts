import { formatFileSize, getFileExt, truncateFileName } from '@fmcoldays/shared'
import type { StatusSetter } from '@/types'
import { EXT_ICON, icon, type IconName } from '@/const'

// ---------------------------------------------------------------------------
// Lightbox — usa <dialog>.showModal() para estar en la top layer del browser
// y aparecer encima de cualquier otro <dialog>.
// ---------------------------------------------------------------------------
function openLightbox(src: string, filename: string): void {
  document.getElementById('dz-lightbox')?.remove()

  const dlg = document.createElement('dialog')
  dlg.id = 'dz-lightbox'
  dlg.style.cssText =
    'background:transparent;border:none;outline:none;padding:0;margin:0;' +
    'max-width:100vw;max-height:100dvh;width:100vw;height:100dvh;overflow:hidden'

  dlg.innerHTML = `
    <style>
      #dz-lightbox::backdrop {
        background: rgba(0,0,0,.87);
        backdrop-filter: blur(6px);
        animation: dz-lb-fade .15s ease;
      }
      @keyframes dz-lb-fade { from { opacity:0 } to { opacity:1 } }
      @keyframes dz-lb-in   { from { opacity:0;transform:scale(.97) } to { opacity:1;transform:scale(1) } }
    </style>

    <div id="dz-lb-backdrop"
         style="display:flex;align-items:center;justify-content:center;
                width:100%;height:100%;cursor:zoom-out">

      <div style="display:flex;flex-direction:column;align-items:center;gap:12px;
                  max-width:min(960px,95vw);width:100%;padding:0 16px;
                  cursor:default;animation:dz-lb-in .15s ease">

        <div style="display:flex;width:100%;align-items:center;justify-content:space-between">
          <span style="color:rgba(255,255,255,.65);font-size:12px;max-width:280px;
                       white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${filename}</span>
          <button id="dz-lb-close"
                  style="display:flex;align-items:center;gap:4px;color:rgba(255,255,255,.7);
                         background:rgba(255,255,255,.08);border:none;cursor:pointer;font-size:12px;
                         padding:5px 10px;border-radius:8px;transition:background .15s"
                  onmouseover="this.style.background='rgba(255,255,255,.18)'"
                  onmouseout="this.style.background='rgba(255,255,255,.08)'">
            ${icon('close', { size: 16 })}
            Cerrar
          </button>
        </div>

        <img src="${src}"
             style="max-width:100%;max-height:85dvh;object-fit:contain;
                    border-radius:14px;box-shadow:0 30px 80px rgba(0,0,0,.6);cursor:default"
             alt="${filename}" />
      </div>
    </div>`

  document.body.appendChild(dlg)
  dlg.showModal()

  const close = (): void => {
    dlg.close()
    dlg.remove()
  }

  dlg.querySelector('#dz-lb-backdrop')!.addEventListener('click', e => {
    if (e.target === dlg.querySelector('#dz-lb-backdrop')) close()
  })

  dlg.querySelector<HTMLButtonElement>('#dz-lb-close')!.addEventListener('click', e => {
    e.stopPropagation()
    close()
  })

  // ESC dispara 'cancel'; lo interceptamos para hacer el cleanup (remove).
  dlg.addEventListener('cancel', e => {
    e.preventDefault()
    close()
  })
}

// ---------------------------------------------------------------------------
// Preview item
// ---------------------------------------------------------------------------
/** Crea el item visual de un archivo (tile con miniatura para imágenes, fila para el resto). */
export function createPreviewItem(file: File, onRemove: () => void): { el: HTMLElement; setStatus: StatusSetter } {
  const isImage = file.type.startsWith('image/')
  const ext = getFileExt(file.name)
  const fileIcon = (EXT_ICON[ext] ?? 'insert_drive_file') as IconName
  const objectUrl: string | null = isImage ? URL.createObjectURL(file) : null

  const el = document.createElement('div')

  if (isImage && objectUrl) {
    // Tile compacto para imágenes.
    el.className = 'relative rounded-xl overflow-hidden border border-gray-200 shrink-0 w-20 h-20 group'

    el.innerHTML = `
      <div class="dz-thumb w-full h-full cursor-zoom-in" title="Ver imagen">
        <img src="${objectUrl}"
             class="w-full h-full object-cover pointer-events-none"
             alt="${file.name}"
             draggable="false" />
      </div>
      <button type="button"
              class="dz-remove absolute top-1 right-1 opacity-0 group-hover:opacity-100
                     transition-all bg-white/90 hover:bg-red-500 hover:text-white
                     text-gray-500 rounded-md w-5 h-5 flex items-center justify-center
                     shadow cursor-pointer">
        ${icon('close', { size: 12 })}
      </button>
      <span class="dz-status hidden"></span>`

    el.querySelector<HTMLElement>('.dz-thumb')!.addEventListener('click', e => {
      e.preventDefault()
      e.stopPropagation()
      openLightbox(objectUrl, file.name)
    })
  } else {
    // Fila completa para archivos no-imagen.
    el.className = 'w-full rounded-lg border border-gray-200 bg-gray-50'

    el.innerHTML = `
      <div class="p-3">
        <div class="flex items-start gap-2">
          <div class="w-9 h-9 rounded-lg bg-linear-to-br from-primary/10 to-primary/5
                      flex items-center justify-center shrink-0 text-primary">
            ${icon(fileIcon, { size: 20 })}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5 mb-1">
              <p class="text-xxs font-semibold text-gray-900">${truncateFileName(file.name)}</p>
              <span class="inline-flex items-center rounded px-1.5 py-0.5 text-xxs font-medium
                           bg-gray-200 text-gray-700 shrink-0">${ext}</span>
            </div>
            <div class="flex items-center gap-2">
              <p class="text-xxs text-gray-500">${formatFileSize(file.size)}</p>
              <span class="dz-status inline-flex items-center gap-0.5 text-xxs text-emerald-600">
                ${icon('done', { size: 14 })}
                <span class="font-medium">Listo</span>
              </span>
            </div>
          </div>
          <button type="button"
                  class="dz-remove shrink-0 p-1.5 size-8 text-gray-400 hover:text-red-600
                         hover:bg-red-50 rounded-lg transition-colors flex items-center
                         justify-center cursor-pointer">
            ${icon('delete', { size: 18 })}
          </button>
        </div>
      </div>`
  }

  // Botón eliminar — revoca el objectUrl para evitar memory leaks.
  el.querySelector<HTMLButtonElement>('.dz-remove')!.addEventListener('click', e => {
    e.preventDefault()
    e.stopPropagation()
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    onRemove()
  })

  // Estado de carga (subida inmediata con data-url).
  const statusEl = el.querySelector<HTMLElement>('.dz-status')
  const setStatus: StatusSetter = state => {
    if (!statusEl) return
    const configs: Record<string, { name: IconName; label: string; color: string; spin: boolean }> = {
      uploading: { name: 'autorenew', label: 'Subiendo...', color: 'text-blue-600', spin: true },
      success: { name: 'done', label: 'Listo', color: 'text-emerald-600', spin: false },
      error: { name: 'error', label: 'Error', color: 'text-red-600', spin: false },
    }
    const c = configs[state]
    statusEl.className = `dz-status inline-flex items-center gap-0.5 text-xxs ${c.color}`
    statusEl.innerHTML = `
      ${icon(c.name, { size: 14, spin: c.spin })}
      <span class="font-medium">${c.label}</span>`
  }

  return { el, setStatus }
}
