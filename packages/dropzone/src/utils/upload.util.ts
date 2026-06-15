import type { DropzoneOptions, StatusSetter } from '@/types'
import { showMessage } from '@/utils/message.util'

/**
 * Sube un archivo inmediatamente vía `fetch` a `opts.uploadUrl` (subida sin
 * submit). Actualiza el estado del item, muestra mensaje, inyecta la respuesta
 * en `opts.target` si se definió y emite eventos `dz:success` / `dz:error`.
 */
export async function uploadFile(
  file: File,
  paramName: string,
  opts: DropzoneOptions,
  setStatus: StatusSetter,
  container: HTMLElement,
): Promise<void> {
  setStatus('uploading')
  const formData = new FormData()
  formData.append(paramName, file)
  try {
    const res = await fetch(opts.uploadUrl!, { method: 'POST', body: formData })
    const text = await res.text()
    if (!res.ok) {
      let msg = 'Error al subir el archivo'
      try {
        msg = (JSON.parse(text) as { message?: string }).message ?? msg
      } catch {
        /* keep default */
      }
      setStatus('error')
      showMessage(container, msg, true)
      container.dispatchEvent(new CustomEvent('dz:error', { bubbles: true, detail: { file, response: text } }))
      return
    }
    setStatus('success')
    showMessage(container, 'Archivo subido correctamente.', false)
    if (opts.target) {
      const target = document.querySelector(opts.target)
      if (target) target.innerHTML = text
    }
    container.dispatchEvent(new CustomEvent('dz:success', { bubbles: true, detail: { file, response: text } }))
  } catch (err) {
    setStatus('error')
    showMessage(container, 'Error de conexión al subir el archivo.', true)
    container.dispatchEvent(new CustomEvent('dz:error', { bubbles: true, detail: { file, error: err } }))
  }
}
