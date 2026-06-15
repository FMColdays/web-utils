/**
 * @fmcoldays/modal
 *
 * Carga vistas parciales Razor en un `<dialog>` vía AJAX. Auto-detecta header,
 * footer, formularios multi-paso, select2 y validación unobtrusive.
 *
 * Uso típico (una vez al arrancar la app): basta importar el paquete y el
 * listener se registra solo (y se expone window.openModal).
 *
 *   import '@fmcoldays/modal'
 *
 * O de forma programática:
 *
 *   import { openModal } from '@fmcoldays/modal'
 *   openModal('/Controller/Action', { method: 'POST', csrf: true })
 */
import { registerModal } from '@/register'

export * from '@/types'
export * from '@/utils'
export * from '@/templates'
export * from '@/const'
export { configureModal, getModalConfig } from '@/config'
export type { ModalConfig } from '@/config'
export { openModal } from '@/open-modal'
export { registerModal }

// Auto-registro al importar el paquete: `import '@fmcoldays/modal'`.
// Idempotente; si prefieres control manual usa el named export registerModal.
registerModal()
