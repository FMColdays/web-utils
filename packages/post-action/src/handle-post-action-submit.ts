import {
  parseOptions,
  findSubmitButton,
  applyLoadingState,
  removeLoadingState,
  updateTarget,
  dismissDialog,
  askConfirmation,
  notifySuccess,
  notifyError,
} from '@/helpers'
import { executeRequest } from '@/services'

export async function handlePostActionSubmit(e: Event): Promise<void> {
  const form = (e.target as HTMLElement).closest<HTMLFormElement>('form[data-action="true"]')
  if (!form) return

  e.preventDefault()

  const opts = parseOptions(form, {
    url:    form.hasAttribute('action') ? form.action : undefined,
    method: form.method.toUpperCase(), // form.method siempre devuelve 'get' o 'post' (default 'get')
  })
  if (!opts) return

  // Si no hay body explícito, usar los campos del form
  if (!opts.bodyJson && !opts.bodyForm && !opts.pick) {
    opts.formData = new FormData(form)
  }

  if (opts.confirm) {
    const confirmed = await askConfirmation(opts)
    if (!confirmed) return
  }

  const submitBtn = findSubmitButton(form)
  applyLoadingState(submitBtn ?? form, null, opts)

  try {
    const { response, serverMsg } = await executeRequest(opts)

    if (response) await updateTarget(response, opts)

    if (!opts.download) await notifySuccess(opts, serverMsg)

    dismissDialog(form, opts.dismiss)

    if (opts.thenSel) {
      document.querySelector<HTMLElement>(opts.thenSel)?.click()
    }

    if (opts.redirect) window.location.href = opts.redirect
    else if (opts.reloadOnSuccess) location.reload()
  } catch (err: unknown) {
    const serverMsg = (err as { serverMsg?: string })?.serverMsg
    notifyError(opts, serverMsg)
  } finally {
    removeLoadingState(submitBtn ?? form, null, opts)
  }
}
