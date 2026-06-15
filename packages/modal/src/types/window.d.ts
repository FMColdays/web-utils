import type { openModal } from '@/open-modal'

/**
 * Expone `window.openModal(...)` para poder llamarlo desde cualquier `<script>`
 * en las vistas Razor sin necesidad de imports. Lo asigna {@link registerModal}.
 */
declare global {
  interface Window {
    openModal: typeof openModal
  }
}

export {}
