import { buildHttpPayload } from '@fmcoldays/shared'
import type { ActionOptions, ActionResult } from '@/types'
import { triggerDownload, parseServerMessage } from '@/helpers'

/**
 * Ejecuta la petición HTTP de un `post-action`. Delega el armado de URL,
 * método, headers y body en `buildHttpPayload` (paquete shared) y resuelve
 * descarga de archivos o lectura del mensaje del servidor.
 *
 * @throws Un `Error` con `serverMsg` adjunto cuando la respuesta no es `ok`.
 */
export async function executeRequest(opts: ActionOptions): Promise<ActionResult> {
  let res: Response

  if (opts.formData) {
    res = await fetch(opts.url, { method: opts.method, body: opts.formData })
  } else {
    const { url, method, headers, body } = buildHttpPayload({
      url: opts.url,
      method: opts.method,
      bodyJson: opts.bodyJson,
      bodyForm: opts.bodyForm,
      pick: opts.pick,
      csrf: opts.csrf,
    })
    res = await fetch(url, { method, headers, body })
  }

  if (!res.ok) {
    const serverMsg = await parseServerMessage(res)
    throw Object.assign(new Error(`HTTP ${res.status}`), { serverMsg })
  }

  if (opts.download) {
    await triggerDownload(res)
    return { ok: true, response: res, serverMsg: undefined }
  }

  const serverMsg = await parseServerMessage(res)
  return { ok: true, response: res, serverMsg }
}
