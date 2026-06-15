import { resolvePick } from '@/http/pick'
import { applyCsrfHeader } from '@/http/csrf'

/** Datos crudos (normalmente leídos de atributos `data-*`) para armar la petición. */
export interface BuildPayloadInput {
  /** URL destino. */
  url: string
  /** Método HTTP. Si se omite: `POST` cuando hay body, `GET` en caso contrario. */
  method?: string
  /** Body como JSON literal estático. En GET se vuelca al query string. */
  bodyJson?: string
  /** Selector de un `<form>` cuyo contenido se envía como FormData (POST) o query string (GET). */
  bodyForm?: string
  /** Mapa `{ campo: selector }` resuelto contra el DOM al momento de la llamada. */
  pick?: Record<string, string>
  /** Incluir el token CSRF en los headers. */
  csrf?: boolean
}

/** Petición ya resuelta: URL final, método, headers y body listos para `fetch`/`$.ajax`. */
export interface HttpPayload {
  url: string
  method: string
  headers: Record<string, string>
  body?: BodyInit
  /** `true` cuando `body` es un `FormData` (relevante para configurar `$.ajax`). */
  isFormData: boolean
}

/**
 * Construye una petición HTTP a partir de datos declarativos. Centraliza la
 * lógica compartida por `post-action` y `modal`:
 *
 * - **GET** → `bodyJson`, `bodyForm` y `pick` se vuelcan al query string.
 * - **POST/PUT/…** → si hay `bodyForm` se envía `FormData`; si no, se mergea
 *   `bodyJson` con `pick` en un body JSON.
 *
 * El método por defecto es inteligente: `POST` si hay algún body, `GET` si no.
 */
export function buildHttpPayload(input: BuildPayloadInput): HttpPayload {
  const defaultMethod = input.bodyJson || input.bodyForm ? 'POST' : 'GET'
  const method = (input.method ?? defaultMethod).toUpperCase()
  const isGet = method === 'GET'
  const picked = input.pick ? resolvePick(input.pick) : {}
  const headers = applyCsrfHeader({}, input.csrf ?? false)

  if (isGet) {
    const params = new URLSearchParams()

    if (input.bodyJson) {
      try {
        const parsed = JSON.parse(input.bodyJson) as Record<string, unknown>
        for (const [k, v] of Object.entries(parsed)) params.append(k, String(v))
      } catch {
        /* JSON inválido: se ignora */
      }
    }

    if (input.bodyForm) {
      const form = document.querySelector<HTMLFormElement>(input.bodyForm)
      if (form) new FormData(form).forEach((v, k) => params.append(k, String(v)))
    }

    for (const [k, v] of Object.entries(picked)) params.append(k, v)

    const qs = params.toString()
    const url = qs ? input.url + (input.url.includes('?') ? '&' : '?') + qs : input.url
    return { url, method, headers, isFormData: false }
  }

  if (input.bodyForm) {
    const form = document.querySelector<HTMLFormElement>(input.bodyForm)
    if (form) return { url: input.url, method, headers, body: new FormData(form), isFormData: true }
  }

  const base: Record<string, unknown> = input.bodyJson ? JSON.parse(input.bodyJson) : {}
  Object.assign(base, picked)
  if (Object.keys(base).length) {
    headers['Content-Type'] = 'application/json'
    return { url: input.url, method, headers, body: JSON.stringify(base), isFormData: false }
  }

  return { url: input.url, method, headers, isFormData: false }
}
