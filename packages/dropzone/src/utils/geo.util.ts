import type { DropzoneOptions } from '@/types'
import { showMessage } from '@/utils/message.util'

function setInputValue(selector: string | null, value: number): void {
  if (!selector) return
  const el = document.querySelector<HTMLInputElement>(selector)
  if (!el) return
  const str = String(value)
  el.value = str // propiedad (lo que se envía en el form)
  el.setAttribute('value', str) // atributo (visible en DevTools / getAttribute)
  // Notificar a frameworks/validaciones que el valor cambió.
  el.dispatchEvent(new Event('input', { bubbles: true }))
  el.dispatchEvent(new Event('change', { bubbles: true }))
}

/**
 * Captura la geolocalización del dispositivo y la escribe en los inputs
 * indicados por `data-geo-lat` / `data-geo-lng`. No hace nada si no se
 * configuraron selectores. Emite `dz:geo` (éxito) o `dz:geo-error` (fallo).
 */
export function captureGeolocation(opts: DropzoneOptions, container: HTMLElement): void {
  if (!opts.geoLatSelector && !opts.geoLngSelector) return

  if (!('geolocation' in navigator)) {
    if (opts.geoNotify) showMessage(container, 'Tu navegador no soporta geolocalización.', true)
    container.dispatchEvent(new CustomEvent('dz:geo-error', { bubbles: true, detail: { reason: 'unsupported' } }))
    return
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude, accuracy } = pos.coords
      setInputValue(opts.geoLatSelector, latitude)
      setInputValue(opts.geoLngSelector, longitude)
      if (opts.geoNotify) showMessage(container, 'Ubicación obtenida correctamente.', false)
      container.dispatchEvent(
        new CustomEvent('dz:geo', { bubbles: true, detail: { latitude, longitude, accuracy } }),
      )
    },
    err => {
      if (opts.geoNotify) showMessage(container, 'No se pudo obtener la ubicación.', true)
      container.dispatchEvent(
        new CustomEvent('dz:geo-error', { bubbles: true, detail: { reason: err.message, code: err.code } }),
      )
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
  )
}
