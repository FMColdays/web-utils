/** Opciones para {@link openModal}, normalmente leídas de atributos `data-modal-*`. */
export interface ModalOptions {
  /** Método HTTP. Default: `POST` si hay body, `GET` si no. */
  method?: string
  /** Body como JSON literal estático. En GET se añade al query string. */
  bodyJson?: string
  /** Selector de un `<form>` → se envía como FormData (POST) o query string (GET). */
  bodyForm?: string
  /** Incluir el token CSRF en el header `RequestVerificationToken`. */
  csrf?: boolean
  /**
   * Mapa `{ campo: selector }` resuelto al momento del click.
   * - GET  → los valores se añaden al query string de la URL.
   * - POST → los valores se mergean en el body JSON.
   */
  pick?: Record<string, string>
}
