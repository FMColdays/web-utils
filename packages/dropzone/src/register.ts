import { initDropzone } from '@/init-dropzone'

/** Inicializa todos los `[data-dropzone]` dentro de `root`. */
export function initAllDropzones(root: Document | HTMLElement = document): void {
  root.querySelectorAll<HTMLElement>('[data-dropzone]').forEach(initDropzone)
}

let observer: MutationObserver | null = null

/**
 * Auto-inicializa cualquier `[data-dropzone]` presente o que aparezca en el DOM
 * (AJAX, modal, partial) vía MutationObserver. Expone `window.initAllDropzones`.
 * Idempotente. Devuelve una función para detener el observer.
 */
export function registerDropzone(): () => void {
  window.initAllDropzones = initAllDropzones

  const start = (): void => {
    if (observer) return
    initAllDropzones()
    observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement)) continue
          if (node.matches('[data-dropzone]')) initDropzone(node)
          node.querySelectorAll<HTMLElement>('[data-dropzone]').forEach(initDropzone)
        }
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true })
  else start()

  return () => {
    observer?.disconnect()
    observer = null
  }
}
