import type { AjaxExtOptions } from '../interfaces'

/** Lee todos los atributos data-ajax-ext-* del elemento y retorna las opciones. */
export function parseAjaxExtOptions(el: HTMLElement): AjaxExtOptions {
  const d = el.dataset
  return {
    confirm:       d.ajaxConfirm,
    confirmTitle:  d.ajaxConfirmTitle,
    disable:       d.ajaxDisable === 'true',
    loadingText:   d.ajaxLoadingText,
    reset:         d.ajaxReset === 'true',
    scrollTo:      d.ajaxScrollTo,
    notify:        d.ajaxNotify,
    notifyError:   d.ajaxNotifyError,
    redirect:      d.ajaxRedirect,
    toggle:        d.ajaxToggle,
    reload:        d.ajaxReload === 'true',
    then:          d.ajaxThen,
    mute:          d.ajaxMute === 'true',
    // false = opt-out explícito; undefined = auto (cierra si está en dialog)
    dismiss:       d.ajaxDismiss === 'false' ? false : d.ajaxDismiss,
    open:          d.ajaxOpen,
    refreshModal:  d.ajaxRefreshModal,
  }
}
