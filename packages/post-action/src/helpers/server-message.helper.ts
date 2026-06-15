const MESSAGE_FIELDS = ['message', 'Message', 'detail', 'Detail', 'title', 'Title', 'error', 'Error']

/** Extrae el primer campo de mensaje conocido de un objeto JSON. */
function pickMessage(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined
  const obj = data as Record<string, unknown>
  for (const field of MESSAGE_FIELDS) {
    const val = obj[field]
    if (typeof val === 'string' && val.trim()) return val.trim()
  }
  return undefined
}

/**
 * Intenta extraer un mensaje legible de la respuesta del servidor.
 *
 * - Si el `Content-Type` contiene `json` (incluye `application/problem+json`):
 *   parsea y busca `message` / `Message` / `detail` / `title` / `error` (acepta
 *   objeto o array, tomando el primer elemento).
 * - Si es `text/plain`: devuelve el texto tal cual (acotado).
 *
 * Devuelve `undefined` si no encuentra nada utilizable. Clona la respuesta
 * para no consumir su stream.
 */
export async function parseServerMessage(res: Response): Promise<string | undefined> {
  try {
    const clone = res.clone()
    const ct = clone.headers.get('Content-Type') ?? ''

    if (ct.includes('json')) {
      const json = await clone.json()
      const data = Array.isArray(json) ? json[0] : json
      return pickMessage(data)
    }

    if (ct.includes('text/plain')) {
      const text = (await clone.text()).trim()
      // Evita devolver páginas de error completas; solo textos cortos.
      return text && text.length <= 300 ? text : undefined
    }

    return undefined
  } catch {
    return undefined
  }
}
