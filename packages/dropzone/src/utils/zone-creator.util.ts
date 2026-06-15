import type { DropzoneOptions } from '@/types'
import { icon } from '@/const'

/** Construye el HTML de la zona visual de drop y devuelve también su `<p>` de label. */
export function createZone(opts: DropzoneOptions): { zone: HTMLElement; labelText: HTMLElement } {
  const exts = opts.acceptedFiles.map(e => e.replace('.', '').toUpperCase()).join(', ')
  const zone = document.createElement('div')
  zone.className =
    'group relative flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-linear-to-b from-gray-50 to-white px-4 py-8 cursor-pointer transition select-none'
  zone.innerHTML = `
    <div class="flex items-center justify-center h-10 w-10 rounded-lg bg-white ring-1 ring-gray-200 shadow-sm transition group-hover:ring-gray-300 text-gray-600">
      ${icon('cloud_upload', { size: 20 })}
    </div>
    <div class="text-center pointer-events-none">
      <p class="text-xs font-semibold text-gray-800 dz-label-text">${opts.label}</p>
      <p class="mt-0.5 text-xxs text-gray-500">${exts} (máx. ${opts.maxFilesize}MB)</p>
    </div>`
  return { zone, labelText: zone.querySelector<HTMLElement>('.dz-label-text')! }
}
