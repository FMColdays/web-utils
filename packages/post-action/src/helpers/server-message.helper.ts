/** Extrae el campo `message` (insensible a mayúsculas) de un objeto JSON. */
function pickMessage(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined
  const obj = data as Record<string, unknown>
  const key = Object.keys(obj).find((k) => k.toLowerCase() === 'message')
  if (!key) return undefined
  const val = obj[key]
  return typeof val === 'string' && val.trim() ? val.trim() : undefined
}

/**
 * Determina si la respuesta JSON indica éxito o error de negocio (HTTP 2xx).
 *
 * Orden de evaluación:
 * 1. Campo `success` booleano (cualquier capitalización) → lo usa directamente.
 * 2. Reglas custom de `configure({ successRules })` → primera que devuelva boolean gana.
 * 3. Ninguna aplica → `undefined` (se confía en el HTTP status).
 */
export async function parseSuccessFlag(res: Response): Promise<boolean | undefined> {
  try {
    const clone = res.clone()
    const ct = clone.headers.get('Content-Type') ?? ''
    if (!ct.includes('json')) return undefined
    const json = await clone.json()
    const data = Array.isArray(json) ? json[0] : json
    if (!data || typeof data !== 'object') return undefined
    const obj = data as Record<string, unknown>

    // 1. Campo success booleano
    const successKey = Object.keys(obj).find((k) => k.toLowerCase() === 'success')
    if (successKey !== undefined) {
      const val = obj[successKey]
      if (typeof val === 'boolean') return val
    }

    // 2. Reglas custom
    const { getConfig } = await import('@/config')
    const cfg = getConfig()

    for (const rule of cfg.errorRules) {
      const result = rule(obj)
      if (result === true) return false
    }

    for (const rule of cfg.successRules) {
      const result = rule(obj)
      if (typeof result === 'boolean') return result
    }

    return undefined
  } catch {
    return undefined
  }
}

/**
 * Intenta extraer un mensaje legible de la respuesta del servidor.
 *
 * - Si el `Content-Type` contiene `json`: parsea y busca el campo `message`
 *   en cualquier capitalización (message, Message, MESSAGE…).
 * - Si es `text/plain`: devuelve el texto tal cual (acotado a 300 chars).
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
      return text && text.length <= 300 ? text : undefined
    }

    return undefined
  } catch {
    return undefined
  }
}
