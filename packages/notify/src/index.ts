/**
 * @fmcoldays/notify
 *
 * Notificaciones (toasts) animadas y diálogo de confirmación, sin dependencias
 * externas (inyectan sus propios estilos). API:
 *
 *   import { popup, confirm } from '@fmcoldays/notify'
 *   await popup({ type: 'success', title: 'Guardado', message: 'Tus cambios se guardaron.' })
 *   const ok = await confirm({ title: '¿Eliminar?', message: 'No se puede deshacer.' })
 */
export * from '@/types'
export * from '@/const'
export { confirm } from '@/confirm'
export type { ConfirmOptions } from '@/confirm'
export { popup } from '@/notify'
export type { NotifyOptions } from '@/notify'
