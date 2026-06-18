import { popup } from '@fmcoldays/notify'
import type { AjaxExtOptions } from '../interfaces'
import {
  applyLoadingState,
  removeLoadingState,
  resetForm,
  scrollToTarget,
  toggleTarget,
  dismissDialog,
  reparseFormValidation,
} from '../helpers'

interface PendingState {
  trigger:      HTMLElement
  form:         HTMLElement
  originalText: string
  opts:         AjaxExtOptions
  xhr?:         XMLHttpRequest
}

let _pending: PendingState | null = null

export function setPending(form: HTMLElement, trigger: HTMLElement, opts: AjaxExtOptions): void {
  _pending = { form, trigger, opts, originalText: '' }
  // Si la validacion cliente bloquea el envio, ajaxSend nunca dispara
  // y _pending.xhr queda null. Auto-limpiar tras 500ms para evitar contaminacion.
  setTimeout(() => {
    if (_pending && !_pending.xhr) _pending = null
  }, 500)
}

export function isAjaxExtPending(): boolean {
  return _pending !== null
}

export function clearPending(): void {
  _pending = null
}

export function handleAjaxSend(xhr: XMLHttpRequest): void {
  if (!_pending) return
  _pending.xhr = xhr
  _pending.originalText = applyLoadingState(_pending.trigger, _pending.opts)
}

export async function handleAjaxComplete(xhr: XMLHttpRequest): Promise<void> {
  if (!_pending || _pending.xhr !== xhr) return

  const { trigger, form, opts, originalText } = _pending
  _pending = null

  removeLoadingState(trigger, originalText, opts)

  // Determinar exito: HTTP status base, pero json.success lo sobreescribe si viene explícito
  let success = xhr.status >= 200 && xhr.status < 300
  let backendMessage: string | undefined
  try {
    const json = JSON.parse(xhr.responseText)
    if (json && typeof json.success === 'boolean') success = json.success
    if (json && typeof json.message === 'string' && json.message.trim())
      backendMessage = json.message.trim()
  } catch { /* no es JSON */ }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (!success) {
    reparseFormValidation(form)
    if (!opts.mute) {
      // Atributo data-ajax-notify-error tiene prioridad sobre mensaje del backend
      const msg = opts.notifyError ?? backendMessage
      if (msg) {
        await popup({ type: 'error', title: 'Error', message: msg })
      }
    }
    return
  }

  // ── Dismiss modal (solo en exito) ────────────────────────────────────────────
  if (opts.dismiss !== false) {
    const isInDialog = !!form.closest('dialog')
    if (opts.dismiss !== undefined || isInDialog) {
      const sel = opts.dismiss && opts.dismiss !== 'true' ? opts.dismiss : undefined
      dismissDialog(form, sel)
    }
  }

  // ── Exito ────────────────────────────────────────────────────────────────────
  if (opts.reset)    resetForm(form)
  if (opts.toggle)   toggleTarget(opts.toggle!)
  if (opts.scrollTo) scrollToTarget(opts.scrollTo!)

  const navigate = (): void => {
    if (opts.redirect) { window.location.href = opts.redirect; return }

    if (opts.open && (window as any).openModal) { (window as any).openModal(opts.open); return }

    if (opts.refreshModal && (window as any).openModal) {
      document.querySelector<HTMLDialogElement>('dialog[open]')?.close()
      ;(window as any).openModal(opts.refreshModal)
      return
    }

    if (opts.then) {
      const thenEl = document.querySelector<HTMLElement>(opts.then)
      if (thenEl) {
        if (thenEl instanceof HTMLFormElement && thenEl.dataset.ajax === 'true') {
          const $ = (window as any).$
          if ($) { $(thenEl).trigger('submit') } else { thenEl.requestSubmit() }
        } else {
          thenEl.click()
        }
        return
      }
    }

    if (opts.reload) window.location.reload()
  }

  if (!opts.mute) {
    // Atributo data-ajax-notify tiene prioridad sobre mensaje del backend
    const msg = opts.notify ?? backendMessage
    if (msg) {
      await popup({ type: 'success', title: 'Exito', message: msg })
      navigate()
      return
    }
  }

  navigate()
}
