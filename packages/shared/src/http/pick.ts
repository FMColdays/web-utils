/**
 * Resuelve un mapa `{ campo: selector }` leyendo el `.value` de cada elemento
 * del DOM al momento de la llamada. Los selectores que no existen se omiten.
 *
 * @example
 * resolvePick({ fecha: '#fecha', id: '#id_caja' })
 * // => { fecha: '2026-06-15', id: '42' }
 */
export function resolvePick(pick: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [field, selector] of Object.entries(pick)) {
    const el = document.querySelector<HTMLInputElement>(selector)
    if (el !== null) result[field] = el.value
  }
  return result
}
