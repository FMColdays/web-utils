/**
 * @fmcoldays/toast
 *
 * Notificaciones (toasts) animadas y diálogo de confirmación, sin dependencias
 * externas (inyectan sus propios estilos). API:
 *
 *   import { toast, confirm } from '@fmcoldays/toast'
 *   toast.success('Guardado', { description: 'Tus cambios se guardaron.' })
 *   const ok = await confirm({ title: '¿Eliminar?', message: 'No se puede deshacer.' })
 */
export * from '@/types'
export * from '@/const'
export { toast } from '@/toast'
export { confirm } from '@/confirm'
export type { ConfirmOptions } from '@/confirm'
export { notify } from '@/notify'
export type { NotifyOptions } from '@/notify'
