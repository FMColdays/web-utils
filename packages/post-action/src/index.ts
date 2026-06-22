/**
 * @fmcoldays/post-action
 *
 * Ejecuta peticiones HTTP al hacer click en cualquier elemento con
 * `data-action-url`. Soporta confirmación, loading state, actualización de
 * targets en el DOM, notificaciones, descarga de archivos y redirección.
 *
 * Uso típico (una vez al arrancar la app): basta importar el paquete y el
 * listener se registra solo.
 *
 *   import '@fmcoldays/post-action'
 */
import { registerPostAction } from '@/register'

export * from '@/types'
export * from '@/helpers'
export * from '@/services'
export * from '@/config'
export { handlePostActionClick } from '@/handle-post-action-click'
export { registerPostAction }

// Auto-registro al importar el paquete: `import '@fmcoldays/post-action'`.
// Idempotente; si prefieres control manual usa el named export registerPostAction.
registerPostAction()
