const TEXT_TYPES = new Set(['text', 'search', 'email', 'number', 'tel', 'url', 'password'])
const debounceTimers = new Map<HTMLElement, ReturnType<typeof setTimeout>>()

function isTextInput(el: HTMLElement): boolean {
  return el instanceof HTMLInputElement && TEXT_TYPES.has(el.type || 'text')
}

function getDelay(el: HTMLElement): number {
  const raw = (el as HTMLInputElement).dataset.actionSubmitDelay
  if (raw !== undefined) {
    const parsed = parseInt(raw, 10)
    return isNaN(parsed) ? 0 : parsed
  }
  return isTextInput(el) ? 400 : 0
}

function clampToRange(el: HTMLElement, form: HTMLFormElement): void {
  if (!(el instanceof HTMLInputElement)) return
  const val = parseFloat(el.value)
  if (isNaN(val)) return
  const min = el.hasAttribute('min') ? parseFloat(el.min) : NaN
  const max = el.hasAttribute('max') ? parseFloat(el.max) : NaN
  let clamped = val
  if (!isNaN(min) && val < min) clamped = min
  if (!isNaN(max) && val > max) clamped = max
  if (clamped === val) return
  el.value = String(clamped)
  if (el.name) {
    const clone = form.querySelector<HTMLInputElement>(`input[data-action-bind-clone="${el.name}"]`)
    if (clone) clone.value = String(clamped)
  }
}

export function handleActionSubmitTrigger(e: Event): void {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-action-submit]')
  if (!el) return

  const sel = el.dataset.actionSubmit
  const form = sel ? document.querySelector<HTMLFormElement>(sel) : el.closest<HTMLFormElement>('form')
  if (!form) return

  if (e.type === 'click' && el instanceof HTMLButtonElement && el.type === 'submit' && el.form === form) return

  // Text inputs: solo 'input', ignorar 'change' para evitar doble-submit
  if (isTextInput(el) && e.type === 'change') return

  // Clampear en cada input para feedback visual inmediato
  if (e.type === 'input') clampToRange(el, form)

  const delay = getDelay(el)
  if (delay > 0) {
    const existing = debounceTimers.get(el)
    if (existing !== undefined) clearTimeout(existing)
    debounceTimers.set(el, setTimeout(() => {
      debounceTimers.delete(el)
      clampToRange(el, form)
      form.requestSubmit()
    }, delay))
    return
  }

  clampToRange(el, form)
  e.preventDefault()
  form.requestSubmit()
}
