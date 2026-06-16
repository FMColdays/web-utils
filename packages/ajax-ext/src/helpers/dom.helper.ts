import type { AjaxExtOptions } from '../interfaces'

const DISABLE_CLASSES = ['opacity-50', 'cursor-not-allowed', '!pointer-events-none']

/** Deshabilita el trigger y aplica texto de carga. Retorna el texto original. */
export function applyLoadingState(trigger: HTMLElement, opts: AjaxExtOptions): string {
  const originalText = trigger.textContent ?? ''

  if (opts.disable) {
    trigger.setAttribute('disabled', 'true')
    ;(trigger as HTMLButtonElement | HTMLInputElement).disabled = true
    trigger.classList.add(...DISABLE_CLASSES)
  }

  if (opts.loadingText) {
    trigger.textContent = opts.loadingText
  }

  return originalText
}

/** Restaura el trigger al estado original. */
export function removeLoadingState(trigger: HTMLElement, originalText: string, opts: AjaxExtOptions): void {
  if (opts.disable) {
    trigger.removeAttribute('disabled')
    ;(trigger as HTMLButtonElement | HTMLInputElement).disabled = false
    trigger.classList.remove(...DISABLE_CLASSES)
  }

  if (opts.loadingText) {
    trigger.textContent = originalText
  }
}

/** Resetea los campos del form. */
export function resetForm(form: HTMLElement): void {
  if (form instanceof HTMLFormElement) form.reset()
}

/** Hace scroll suave al elemento indicado por selector. */
export function scrollToTarget(selector: string): void {
  const target = document.querySelector<HTMLElement>(selector)
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Alterna la clase `hidden` del elemento indicado por selector. */
export function toggleTarget(selector: string): void {
  const target = document.querySelector<HTMLElement>(selector)
  if (target) target.classList.toggle('hidden')
}

/**
 * Re-parsea la validacion unobtrusive del form.
 * Util despues de un error para que jQuery Validation muestre mensajes del servidor.
 */
export function reparseFormValidation(form: HTMLElement): void {
  const $ = (window as any).$
  if (!$) return
  const $form = $(form)
  if ($.validator?.unobtrusive) {
    $.validator.unobtrusive.parse($form)
  }
}

/** Cierra el dialog indicado por selector, o el mas cercano al form / el primero abierto. */
export function dismissDialog(form: HTMLElement, selector?: string): void {
  let dialog: HTMLDialogElement | null = null

  if (selector) {
    dialog = document.querySelector<HTMLDialogElement>(selector)
  } else {
    dialog =
      form.closest<HTMLDialogElement>('dialog') ??
      document.querySelector<HTMLDialogElement>('dialog[open]')
  }

  dialog?.close()
}

/** Busca el boton de submit activo dentro de un form. */
export function findSubmitButton(form: HTMLFormElement): HTMLButtonElement | HTMLInputElement | null {
  return (
    form.querySelector<HTMLButtonElement>('button[type="submit"]') ??
    form.querySelector<HTMLInputElement>('input[type="submit"]') ??
    form.querySelector<HTMLButtonElement>('button:not([type="button"]):not([type="reset"])')
  )
}
