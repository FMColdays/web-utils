export interface AjaxExtOptions {
  /** Mensaje para el dialogo de confirmacion antes de enviar. */
  confirm?: string
  /** Titulo del dialogo de confirmacion. */
  confirmTitle?: string
  /** Deshabilita el form/boton durante la peticion. */
  disable?: boolean
  /** Texto del boton durante la peticion. */
  loadingText?: string
  /** Resetea el form al completar con exito. */
  reset?: boolean
  /** Selector CSS al que hacer scroll al completar. */
  scrollTo?: string
  /** Mensaje notify de exito al completar. Tiene prioridad sobre el mensaje del backend. */
  notify?: string
  /** Mensaje notify de error al completar. Tiene prioridad sobre el mensaje del backend. */
  notifyError?: string
  /** URL a la que redirigir al completar con exito. */
  redirect?: string
  /** Selector CSS del elemento a mostrar/ocultar al completar. */
  toggle?: string
  /** Recarga la pagina al completar. */
  reload?: boolean
  /**
   * Selector del elemento a disparar tras completar con exito.
   * - Si es <form data-ajax> → re-envía el form.
   * - Cualquier otro elemento → hace click.
   */
  then?: string
  /**
   * Suprime cualquier notificacion, tanto la del backend como la de
   * data-ajax-toast / data-ajax-toast-error.
   */
  mute?: boolean
  /**
   * Controla el cierre del modal al completar con exito.
   * - `undefined` (default) → cierra si el form esta dentro de un `<dialog>`.
   * - `"true"` o selector CSS → cierra explicitamente.
   * - `false` → nunca cierra.
   */
  dismiss?: string | false
  /**
   * Abre un nuevo modal al completar con exito.
   * Valor: URL del PartialView a cargar.
   */
  open?: string
  /**
   * Cierra el modal actual y lo reabre con nuevo contenido al completar con exito.
   * Valor: URL del PartialView a cargar.
   */
  refreshModal?: string
}
