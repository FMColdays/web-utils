/**
 * Busca el primer elemento que coincida con el selector o lanza un error.
 * Útil para evitar null checks repetitivos cuando el elemento es obligatorio.
 */
export function queryRequired<T extends HTMLElement>(
  selector: string,
  root: Document | HTMLElement = document,
): T {
  const el = root.querySelector<T>(selector)
  if (!el) throw new Error(`Element not found: ${selector}`)
  return el
}
