import { handlePostActionClick } from '@/handle-post-action-click'

/** Listener estable (envuelve el handler async para devolver void y poder removerlo). */
const listener: EventListener = (e) => {
  void handlePostActionClick(e as MouseEvent)
}

/**
 * Registra el listener global de `post-action` mediante event delegation sobre
 * `document`. Idempotente: llamarlo varias veces no duplica el handler.
 *
 * @returns Función para desregistrar el listener.
 */
export function registerPostAction(root: Document | HTMLElement = document): () => void {
  root.removeEventListener('click', listener)
  root.addEventListener('click', listener)
  return () => root.removeEventListener('click', listener)
}
