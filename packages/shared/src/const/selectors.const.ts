/** Selector por defecto del spinner global de la aplicación. */
export const DEFAULT_SPINNER_SEL = '.spinner__contenedor'

/** Nombre del input oculto que contiene el token antiforgery de ASP.NET. */
export const CSRF_INPUT_SEL = 'input[name="__RequestVerificationToken"]'

/** Meta tag alternativo desde el que leer el token CSRF. */
export const CSRF_META_SEL = 'meta[name="csrf-token"]'

/** Header HTTP en el que se envía el token CSRF a ASP.NET. */
export const CSRF_HEADER = 'RequestVerificationToken'
