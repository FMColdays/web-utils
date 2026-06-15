import type { DropzoneOptions } from '@/types'

/** Lee los atributos `data-*` del contenedor y los normaliza en {@link DropzoneOptions}. */
export function parseOptions(el: HTMLElement): DropzoneOptions {
  const rawAccepted = el.dataset.acceptedFiles ?? '.jpg,.jpeg,.png,.pdf'
  return {
    acceptedFiles: rawAccepted.split(',').map(s => s.trim().toLowerCase()),
    maxFilesize: parseFloat(el.dataset.maxFilesize ?? '10'),
    maxFiles: parseInt(el.dataset.maxFiles ?? '1', 10),
    label: el.dataset.label ?? 'Arrastra aquí o selecciona',
    uploadUrl: el.dataset.url ?? null,
    uploadParam: el.dataset.uploadParam ?? null,
    target: el.dataset.target ?? null,
    geoLatSelector: el.dataset.geoLat ?? null,
    geoLngSelector: el.dataset.geoLng ?? null,
    geoNotify: el.dataset.geoNotify === 'true',
  }
}
