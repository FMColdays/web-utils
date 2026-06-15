import { MODAL_SEL, MODAL_BODY_SEL } from '@/const'
import { defaultLoadingTemplate } from '@/templates'

/** Configuración del modal: selectores y comportamiento del loading. */
export interface ModalConfig {
  /** Selector del `<dialog>`. Default: `#dialog-form`. */
  dialog: string
  /** Selector del contenedor donde se inyecta la vista parcial. Default: `#dialog-form #modal-body`. */
  body: string
  /**
   * Selector OPCIONAL de un elemento de loading propio de la app. Si se define
   * y existe, el modal lo muestra/oculta (`display`) en vez de usar el loading
   * integrado. Útil si ya tienes un overlay/spinner global.
   */
  loadingSelector?: string
  /** HTML del loading integrado (se inyecta en el body mientras carga). Sobrescribible. */
  loadingTemplate: () => string
  /**
   * Hook OPCIONAL al iniciar la carga. Si se define, el modal NO inyecta el
   * loading integrado ni se abre hasta tener el contenido: delega el loading a
   * este callback (ideal para un overlay full-screen como Notiflix.Loading).
   */
  onLoadingStart?: () => void
  /** Hook OPCIONAL al terminar la carga (éxito o error). Pareja de `onLoadingStart`. */
  onLoadingEnd?: () => void
}

const config: ModalConfig = {
  dialog: MODAL_SEL,
  body: MODAL_BODY_SEL,
  loadingTemplate: defaultLoadingTemplate,
}

/**
 * Ajusta la configuración del modal. Llamar una vez al arrancar la app.
 *
 * @example
 * // apuntar a un contenedor con otro id
 * configureModal({ body: '#dialog-form #modal-content' })
 * // usar tu propio elemento de loading en vez del integrado
 * configureModal({ loadingSelector: '#mi-loading' })
 * // personalizar el spinner integrado
 * configureModal({ loadingTemplate: () => '<p>Cargando…</p>' })
 * // delegar el loading a Notiflix (overlay full-screen)
 * import { Loading } from 'notiflix'
 * configureModal({ onLoadingStart: () => Loading.circle(), onLoadingEnd: () => Loading.remove() })
 */
export function configureModal(partial: Partial<ModalConfig>): void {
  Object.assign(config, partial)
}

/** Devuelve la configuración actual (resuelta al momento de abrir el modal). */
export function getModalConfig(): Readonly<ModalConfig> {
  return config
}
