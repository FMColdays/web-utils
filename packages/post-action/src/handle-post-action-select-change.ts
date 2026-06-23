import {
  parseOptions,
  applyLoadingState,
  removeLoadingState,
  updateTarget,
  dismissDialog,
  notifySuccess,
  notifyError,
  injectSkeleton,
} from '@/helpers'
import { executeRequest } from '@/services'

/**
 * Handler para `select[data-action="true"]`.
 * Cuando el select cambia, arma la URL con `name=value` y ejecuta la petición.
 * Compatible con Select2: puede llamarse desde el bridge de jQuery o desde el
 * listener nativo de `change`.
 */
export async function handlePostActionSelectChange(select: HTMLSelectElement): Promise<void> {
  const opts = parseOptions(select, { method: 'GET' })
  if (!opts) return

  // Un select que cambia nunca debe cerrar el modal a menos que se indique explícitamente
  opts.dismiss ??= false

  if (select.name) {
    const sep = opts.url.includes('?') ? '&' : '?'
    opts.url = `${opts.url}${sep}${encodeURIComponent(select.name)}=${encodeURIComponent(select.value)}`
  }

  applyLoadingState(select, null, opts)
  injectSkeleton(opts)

  try {
    const { response, serverMsg } = await executeRequest(opts)

    if (response) await updateTarget(response, opts)

    dismissDialog(select, opts.dismiss)

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
    removeLoadingState(select, null, opts)
  }
}
