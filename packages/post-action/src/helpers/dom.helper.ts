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
  else {
    targetEl.innerHTML = value
    targetEl.dispatchEvent(new CustomEvent('post-action:updated', { bubbles: true }))
  }
}

/** Cierra el dialog padre o el especificado por selector. `false` = nunca cerrar. */
export function dismissDialog(trigger: HTMLElement, dismiss: string | false | undefined): void {
  if (dismiss === false) return
  const dialog = (dismiss && dismiss !== 'true')
    ? document.querySelector<HTMLDialogElement>(dismiss)
    : trigger.closest<HTMLDialogElement>('dialog')
  dialog?.close()
}

/** Retorna el botón de submit activo de un form, o null si no hay. */
export function findSubmitButton(form: HTMLFormElement): HTMLButtonElement | HTMLInputElement | null {
  // 1. Dentro del form
  const inside = form.querySelector<HTMLButtonElement | HTMLInputElement>('[type="submit"]:not([disabled])')
  if (inside) return inside
  // 2. Asociado por atributo form="id"
  if (form.id) {
    const associated = document.querySelector<HTMLButtonElement | HTMLInputElement>(
      `[form="${form.id}"][type="submit"]:not([disabled])`
    )
    if (associated) return associated
  }
  // 3. En el dialog padre (modal puede mover el footer fuera del form)
  const dialog = form.closest('dialog')
  if (dialog) {
    return dialog.querySelector<HTMLButtonElement | HTMLInputElement>('[type="submit"]:not([disabled])')
  }
  return null
}

const DEFAULT_SKELETON = `<div style="padding:1rem;display:flex;flex-direction:column;gap:.75rem">
${Array.from({ length: 5 }, (_, i) => `  <div style="height:1rem;border-radius:4px;background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%);background-size:600px 100%;animation:pa-shimmer 1.4s infinite linear;width:${i % 2 === 0 ? '100%' : '75%'}"></div>`).join('\n')}
</div>`

const SK_STYLE_ID = 'pa-skeleton-style'

function ensureSkeletonStyle(): void {
  if (document.getElementById(SK_STYLE_ID)) return
  const s = document.createElement('style')
  s.id = SK_STYLE_ID
  s.textContent = '@keyframes pa-shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}'
  document.head.appendChild(s)
}

/** Inyecta el skeleton en el target antes del request. `false` = sin skeleton. */
export function injectSkeleton(opts: ActionOptions): void {
  if (opts.skeleton === false || !opts.targetSel) return
  const target = document.querySelector(opts.targetSel)
  if (!target) return
  ensureSkeletonStyle()
  if (opts.skeleton) {
    const src = document.querySelector(opts.skeleton)
    if (src) { target.innerHTML = src.outerHTML; return }
  }
  target.innerHTML = DEFAULT_SKELETON
}

/** Togglea el estado de un checkbox/radio tras una acción exitosa. */
export function applyInputChange(inputEl: HTMLInputElement | null): void {
  if (!inputEl) return

  if (inputEl.type === 'checkbox') inputEl.checked = !inputEl.checked
  else if (inputEl.type === 'radio') inputEl.checked = true
}
