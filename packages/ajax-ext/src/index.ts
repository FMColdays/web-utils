import { confirm as toastConfirm } from '@fmcoldays/toast'
import { parseAjaxExtOptions, findSubmitButton } from './helpers'
import { setPending, handleAjaxSend, handleAjaxComplete, isAjaxExtPending } from './services'
import type { AjaxExtOptions } from './interfaces'

// Exponer en window para que site.js los llame en ajaxSend/ajaxComplete
;(window as any).handleAjaxSend     = handleAjaxSend
;(window as any).handleAjaxComplete = handleAjaxComplete
;(window as any).isAjaxExtPending   = isAjaxExtPending

export { handleAjaxSend, handleAjaxComplete, isAjaxExtPending }
export type { AjaxExtOptions }

/** Determina si el elemento tiene al menos una extension ajax-ext activa. */
function hasAnyExtension(opts: AjaxExtOptions, el: HTMLElement): boolean {
  if (opts.dismiss !== false && el.closest('dialog')) return true

  return !!(
    opts.confirm      !== undefined ||
    opts.disable      ||
    opts.loadingText  !== undefined ||
    opts.reset        ||
    opts.scrollTo     !== undefined ||
    opts.notify       !== undefined ||
    opts.notifyError  !== undefined ||
    opts.redirect     !== undefined ||
    opts.toggle       !== undefined ||
    opts.open         !== undefined ||
    opts.refreshModal !== undefined ||
    opts.then         !== undefined ||
    opts.reload
  )
}

// WeakMap para pasar opts+trigger a la segunda pasada del submit (tras confirmacion async)
const _confirmedForms    = new WeakMap<HTMLFormElement, { trigger: HTMLElement; opts: AjaxExtOptions }>()
const _confirmedAnchors  = new WeakMap<HTMLAnchorElement, { opts: AjaxExtOptions }>()

// ── <form data-ajax="true"> — intercepta submit ──────────────────────────────
document.addEventListener(
  'submit',
  (e: Event) => {
    const form = (e.target as HTMLElement).closest<HTMLFormElement>('form[data-ajax="true"]')
    if (!form) return

    // Segunda pasada: viene de requestSubmit() tras confirmacion — dejar pasar
    const prev = _confirmedForms.get(form)
    if (prev) {
      _confirmedForms.delete(form)
      setPending(form, prev.trigger, prev.opts)
      return
    }

    const opts = parseAjaxExtOptions(form)
    if (!hasAnyExtension(opts, form)) return

    const trigger = findSubmitButton(form) ?? form

    if (opts.confirm !== undefined) {
      e.preventDefault()
      e.stopImmediatePropagation()
      toastConfirm({
        title:       opts.confirmTitle,
        message:     opts.confirm || '¿Estas seguro? Esta accion no se puede deshacer.',
        confirmText: 'Si, continuar',
      }).then(ok => {
        if (!ok) return
        _confirmedForms.set(form, { trigger, opts })
        form.requestSubmit()
      })
      return
    }

    setPending(form, trigger, opts)
  },
  true  // capture phase: interceptar antes de jQuery Unobtrusive
)

// ── <a data-ajax="true"> — intercepta click ──────────────────────────────────
document.addEventListener(
  'click',
  (e: Event) => {
    const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[data-ajax="true"]')
    if (!anchor) return

    // Segunda pasada: viene de anchor.click() tras confirmacion — dejar pasar
    const prev = _confirmedAnchors.get(anchor)
    if (prev) {
      _confirmedAnchors.delete(anchor)
      setPending(anchor as unknown as HTMLFormElement, anchor, prev.opts)
      return
    }

    const opts = parseAjaxExtOptions(anchor)
    if (!hasAnyExtension(opts, anchor)) return

    if (opts.confirm !== undefined) {
      e.preventDefault()
      e.stopImmediatePropagation()
      toastConfirm({
        title:       opts.confirmTitle,
        message:     opts.confirm || '¿Estas seguro? Esta accion no se puede deshacer.',
        confirmText: 'Si, continuar',
      }).then(ok => {
        if (!ok) return
        _confirmedAnchors.set(anchor, { opts })
        anchor.click()
      })
      return
    }

    setPending(anchor as unknown as HTMLFormElement, anchor, opts)
  },
  true
)
