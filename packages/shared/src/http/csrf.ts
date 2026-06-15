import { CSRF_INPUT_SEL, CSRF_META_SEL, CSRF_HEADER } from '@/const'

/**
 * Lee el token antiforgery del DOM: primero del input oculto de ASP.NET y,
 * como fallback, del meta tag `csrf-token`. Devuelve `undefined` si no existe.
 */
export function resolveCsrfToken(): string | undefined {
  return (
    document.querySelector<HTMLInputElement>(CSRF_INPUT_SEL)?.value ??
    document.querySelector<HTMLMetaElement>(CSRF_META_SEL)?.content
  )
}

/**
 * Si `enabled` es true y existe token, añade el header CSRF al objeto de
 * headers recibido (mutándolo) y lo devuelve.
 */
export function applyCsrfHeader(
  headers: Record<string, string>,
  enabled: boolean,
): Record<string, string> {
  if (!enabled) return headers
  const token = resolveCsrfToken()
  if (token) headers[CSRF_HEADER] = token
  return headers
}
