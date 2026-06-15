import {
  parseOptions,
  applyLoadingState,
  removeLoadingState,
  updateTarget,
  applyInputChange,
  askConfirmation,
  notifySuccess,
  notifyError,
} from '@/helpers'
import { executeRequest } from '@/services'

/**
 * Handler de click para `post-action`. Resuelve el trigger más cercano con
 * `data-action-url` y orquesta el ciclo completo: confirmación → loading →
 * petición → actualización de DOM → notificación → post-éxito.
 */
export async function handlePostActionClick(e: MouseEvent): Promise<void> {
  const target = e.target as HTMLElement
  const trigger = target.closest<HTMLElement>('[data-action-url]')
  if (!trigger) return

  e.preventDefault()

  const opts = parseOptions(trigger)
  if (!opts) return

  const inputEl = trigger instanceof HTMLInputElement ? trigger : null

  if (opts.confirm) {
    const confirmed = await askConfirmation(opts)
    if (!confirmed) return
  }

  applyLoadingState(trigger, inputEl, opts)

  try {
    const { response, serverMsg } = await executeRequest(opts)

    applyInputChange(inputEl)

    if (response) await updateTarget(response, opts)

    await notifySuccess(opts, serverMsg)

    if (opts.thenSel) {
      document.querySelector<HTMLElement>(opts.thenSel)?.click()
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
