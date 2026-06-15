import type { ActionOptions } from '@/types'

/** Aplica el estado de carga al trigger (disabled + clases de loading). */
export function applyLoadingState(
  trigger: HTMLElement,
  inputEl: HTMLInputElement | null,
  opts: ActionOptions,
): void {
  if (opts.disable) {
    if (inputEl) inputEl.disabled = true
    else trigger.setAttribute('disabled', 'true')
  }
  opts.loadingClass?.split(' ').forEach(c => trigger.classList.add(c))
}

/** Revierte el estado de carga aplicado por {@link applyLoadingState}. */
export function removeLoadingState(
  trigger: HTMLElement,
  inputEl: HTMLInputElement | null,
  opts: ActionOptions,
): void {
  if (opts.disable) {
    if (inputEl) inputEl.disabled = false
    else trigger.removeAttribute('disabled')
  }
  opts.loadingClass?.split(' ').forEach(c => trigger.classList.remove(c))
}

/** Inyecta la respuesta en el target del DOM según `targetProp` (html/text/value). */
export async function updateTarget(res: Response, opts: ActionOptions): Promise<void> {
  if (!opts.targetSel) return

  const targetEl = document.querySelector(opts.targetSel)
  if (!targetEl) return

  const isJson = res.headers.get('Content-Type')?.includes('application/json') ?? false

  let value: string

  if (isJson) {
    const json = await res.json()
    value = typeof json === 'object' ? JSON.stringify(json) : String(json)
  } else {
    value = await res.text()
  }

  if (opts.targetProp === 'text') targetEl.textContent = value
  else if (opts.targetProp === 'value') (targetEl as HTMLInputElement).value = value
  else targetEl.innerHTML = value
}

/** Togglea el estado de un checkbox/radio tras una acción exitosa. */
export function applyInputChange(inputEl: HTMLInputElement | null): void {
  if (!inputEl) return

  if (inputEl.type === 'checkbox') inputEl.checked = !inputEl.checked
  else if (inputEl.type === 'radio') inputEl.checked = true
}
