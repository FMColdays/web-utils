import { handlePostActionClick } from '@/handle-post-action-click'
import { handlePostActionSubmit } from '@/handle-post-action-submit'
import { handleActionSubmitTrigger } from '@/handle-action-submit-trigger'
import { bindElements } from '@/bind-elements'

const clickListener: EventListener = (e) => { void handlePostActionClick(e as MouseEvent) }
const submitListener: EventListener = (e) => { void handlePostActionSubmit(e) }
const submitTriggerListener: EventListener = (e) => { handleActionSubmitTrigger(e) }

function whenReady(fn: () => void): void {
  if (document.readyState !== 'loading') fn()
  else document.addEventListener('DOMContentLoaded', fn, { once: true })
}

/**
 * Registra los listeners globales de `post-action` sobre `document`.
 * Idempotente: llamarlo varias veces no duplica los handlers.
 * `data-action-bind` se inicializa cuando el DOM esté listo.
 *
 * @returns Función para desregistrar todos los listeners.
 */
let updatedListener: (() => void) | null = null

export function registerPostAction(root: Document | HTMLElement = document): () => void {
  whenReady(() => bindElements(root))

  if (updatedListener) root.removeEventListener('post-action:updated', updatedListener)
  updatedListener = () => bindElements(root)
  root.addEventListener('post-action:updated', updatedListener)

  root.removeEventListener('click', clickListener)
  root.addEventListener('click', clickListener)

  root.removeEventListener('change', submitTriggerListener)
  root.addEventListener('change', submitTriggerListener)

  root.removeEventListener('input', submitTriggerListener)
  root.addEventListener('input', submitTriggerListener)

  // Capture phase: interceptar submit antes de la validación nativa del browser
  root.removeEventListener('submit', submitListener, true)
  root.addEventListener('submit', submitListener, true)

  return () => {
    if (updatedListener) root.removeEventListener('post-action:updated', updatedListener)
    root.removeEventListener('click', clickListener)
    root.removeEventListener('change', submitTriggerListener)
    root.removeEventListener('input', submitTriggerListener)
    root.removeEventListener('submit', submitListener, true)
  }
}
