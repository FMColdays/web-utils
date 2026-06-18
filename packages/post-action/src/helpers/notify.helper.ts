import { popup, confirm } from '@fmcoldays/notify'
import type { ActionOptions } from '@/types'

/** Muestra el diálogo de confirmación. Resuelve a `true` si el usuario confirma. */
export function askConfirmation(opts: ActionOptions): Promise<boolean> {
  return confirm({
    title: opts.confirmTitle,
    message: opts.confirmMsg,
    confirmText: 'Sí, continuar',
    cancelText: 'Cancelar',
    type: 'warning',
  })
}

/** Notifica éxito salvo que `silent` esté activo. Prefiere el mensaje del servidor. */
export async function notifySuccess(opts: ActionOptions, serverMsg?: string): Promise<void> {
  if (opts.silent) return
  await popup({ type: 'success', title: 'Éxito', message: serverMsg ?? opts.successMsg })
}

/** Notifica error. Los errores se muestran SIEMPRE (incluso con `silent`). */
export async function notifyError(opts: ActionOptions, serverMsg?: string): Promise<void> {
  await popup({ type: 'error', title: 'Error', message: serverMsg ?? opts.errorMsg })
}
