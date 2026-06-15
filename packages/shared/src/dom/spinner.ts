import { DEFAULT_SPINNER_SEL } from '@/const'

/**
 * Selector del spinner activo. Configurable por si la app usa otra clase/id.
 * @see configureSpinner
 */
let spinnerSelector = DEFAULT_SPINNER_SEL

/**
 * Cambia el selector del spinner global usado por {@link showSpinner} y
 * {@link hideSpinner}. Llamar una vez al arrancar la app si no se usa el
 * selector por defecto (`.spinner__contenedor`).
 */
export function configureSpinner(selector: string): void {
  spinnerSelector = selector
}

/** Muestra el spinner global de la aplicación. */
export function showSpinner(): void {
  const el = document.querySelector<HTMLElement>(spinnerSelector)
  if (el) el.style.display = 'flex'
}

/** Oculta el spinner global de la aplicación. */
export function hideSpinner(): void {
  const el = document.querySelector<HTMLElement>(spinnerSelector)
  if (el) el.style.display = 'none'
}
