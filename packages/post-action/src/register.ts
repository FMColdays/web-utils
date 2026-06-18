import { handlePostActionClick } from '@/handle-post-action-click'
import { handlePostActionSubmit } from '@/handle-post-action-submit'

const clickListener: EventListener = (e) => { void handlePostActionClick(e as MouseEvent) }
const submitListener: EventListener = (e) => { void handlePostActionSubmit(e) }

/**
 * Registra los listeners globales de `post-action` sobre `document`.
 * Idempotente: llamarlo varias veces no duplica los handlers.
 *
 * @returns Función para desregistrar ambos listeners.
 */
export function registerPostAction(root: Document | HTMLElement = document): () => void {
  root.removeEventListener('click', clickListener)
  root.addEventListener('click', clickListener)

  // Capture phase: interceptar submit antes de la validación nativa del browser
  root.removeEventListener('submit', submitListener, true)
  root.addEventListener('submit', submitListener, true)

  return () => {
    root.removeEventListener('click', clickListener)
    root.removeEventListener('submit', submitListener, true)
  }
}
