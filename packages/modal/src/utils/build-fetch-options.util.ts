import { buildHttpPayload } from '@fmcoldays/shared'
import type { ModalOptions } from '@/types'

/** Traduce las {@link ModalOptions} a una URL + `RequestInit` para `fetch`. */
export function buildFetchOptions(url: string, opts: ModalOptions): { url: string; init: RequestInit } {
  const payload = buildHttpPayload({
    url,
    method: opts.method,
    bodyJson: opts.bodyJson,
    bodyForm: opts.bodyForm,
    pick: opts.pick,
    csrf: opts.csrf,
  })

  const init: RequestInit = { method: payload.method }

  if (payload.body !== undefined) {
    init.body = payload.body as BodyInit
  }

  const headerEntries = Object.entries(payload.headers as Record<string, string>)
  if (headerEntries.length) init.headers = Object.fromEntries(headerEntries)

  return { url: payload.url, init }
}
