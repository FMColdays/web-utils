import type { initAllDropzones } from '@/register'

/** Expone `window.initAllDropzones(...)` para re-inicializar dropzones desde cualquier script. */
declare global {
  interface Window {
    initAllDropzones: typeof initAllDropzones
  }
}

export {}
