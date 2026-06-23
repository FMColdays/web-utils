import {
  parseOptions,
  applyLoadingState,
  removeLoadingState,
  updateTarget,
  applyInputChange,
  dismissDialog,
  askConfirmation,
  notifySuccess,
  notifyError,
  injectSkeleton,
} from '@/helpers'
import { executeRequest } from '@/services'

/**
 * Handler de click para `post-action`. Resuelve el trigger más cercano con
 * `data-action-url` y orquesta el ciclo completo: confirmación → loading →
 * petición → actualización de DOM → notificación → post-éxito.
 */
export async function handlePostActionClick(e: MouseEvent): Promise<void> {
  const target = e.target as HTMLElement
  const trigger = target.closest<HTMLElement>('[data-action="true"]')
  if (!trigger) return
  if (trigger instanceof HTMLFormElement) return // forms handled by submit listener
  if (trigger instanceof HTMLSelectElement) return // selects handled by change listener

  e.preventDefault()

  const isAnchor = trigger instanceof HTMLAnchorElement
  const opts = parseOptions(trigger, {
    url:    isAnchor && trigger.hasAttribute('href') ? trigger.href : undefined,
    method: isAnchor ? 'GET' : undefined,
  })
  if (!opts) return

  const inputEl = trigger instanceof HTMLInputElement ? trigger : null

  if (opts.confirm) {
    const confirmed = await askConfirmation(opts)
    if (!confirmed) return
  }

  applyLoadingState(trigger, inputEl, opts)
  injectSkeleton(opts)

  try {
    const { response, serverMsg } = await executeRequest(opts)

    applyInputChange(inputEl)

    if (response) await updateTarget(response, opts)

    dismissDialog(trigger, opts.dismiss)

    if (opts.silent !== true && (opts.silent === false || !opts.targetSel)) await notifySuccess(opts, serverMsg)

    if (opts.thenSel) {
      const thenEl = document.querySelector<HTMLElement>(opts.thenSel)
      if (thenEl instanceof HTMLFormElement) thenEl.requestSubmit()
      else thenEl?.click()
    }

    if (opts.redirect) window.location.href = opts.redirect
    else if (opts.reloadOnSuccess) location.reload()
  } catch (err: unknown) {
    const serverMsg = (err as { serverMsg?: string })?.serverMsg
    notifyError(opts, serverMsg)
  } finally {
    removeLoadingState(trigger, inputEl, opts)
  }
}
