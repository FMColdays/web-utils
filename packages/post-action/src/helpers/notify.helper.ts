import { toast, confirm } from '@fmcoldays/toast'
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
  toast.success('Éxito', { description: serverMsg ?? opts.successMsg })
}

/**
 * Notifica error. Los errores se muestran SIEMPRE (incluso con `silent`),
 * porque `silent` solo silencia el toast de éxito. Prefiere el mensaje del servidor.
 */
export function notifyError(opts: ActionOptions, serverMsg?: string): void {
  toast.error('Error', { description: serverMsg ?? opts.errorMsg })
}
