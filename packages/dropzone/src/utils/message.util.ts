import { icon } from '@/const'

/** Muestra un mensaje de éxito/error dentro del contenedor del dropzone. */
export function showMessage(container: HTMLElement, text: string, isError: boolean): void {
  container.querySelector('.dz-message')?.remove()
  const div = document.createElement('div')
  div.className = `dz-message mt-2 flex items-start gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
    isError ? 'bg-red-50 text-red-700 ring-1 ring-red-200' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
  }`
  div.innerHTML = `
    <span class="shrink-0">${icon(isError ? 'error' : 'check_circle', { size: 16 })}</span>
    <span class="flex-1">${text}</span>
    <button type="button" class="dz-msg-close shrink-0 ml-auto -mt-0.5 -mr-0.5 p-1 rounded hover:bg-black/10 transition-colors">
      ${icon('close', { size: 16 })}
    </button>`
  div.querySelector('.dz-msg-close')!.addEventListener('click', () => div.remove())
  container.appendChild(div)
  if (!isError) setTimeout(() => div.remove(), 5000)
}
