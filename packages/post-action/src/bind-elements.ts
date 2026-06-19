interface BindEntry { clone: HTMLInputElement; sync: () => void }
const bindRegistry = new WeakMap<HTMLElement, BindEntry>()

/**
 * Procesa `data-action-bind="#form-selector"` en el momento del registro.
 * Crea un input dentro del form que refleja el valor del elemento original.
 * Por defecto el clon es hidden; `data-action-bind-visible="true"` lo hace visible.
 * Idempotente: si el clon ya existe y sigue en el DOM no hace nada; si el form
 * fue reemplazado por AJAX recrea el clon y reconecta los listeners.
 */
export function bindElements(root: Document | HTMLElement = document): void {
  root.querySelectorAll<HTMLElement>('[data-action-bind]').forEach(el => {
    const formSel = el.dataset.actionBind
    if (!formSel) return

    const form = document.querySelector<HTMLFormElement>(formSel)
    if (!form) return

    const name = (el as HTMLInputElement).name
    if (!name) return

    const existing = bindRegistry.get(el)
    if (existing && form.contains(existing.clone)) return // clon sigue vivo, nada que hacer

    // Limpiar listeners viejos si los hay
    if (existing) {
      el.removeEventListener('change', existing.sync)
      el.removeEventListener('input', existing.sync)
    }

    // Eliminar cualquier clon huérfano con el mismo nombre (el input fue reemplazado por AJAX)
    form.querySelectorAll<HTMLInputElement>(`input[data-action-bind-clone="${name}"]`).forEach(c => c.remove())

    const visible = el.dataset.actionBindVisible === 'true'
    const clone = document.createElement('input')
    clone.type = visible ? ((el as HTMLInputElement).type || 'text') : 'hidden'
    clone.name = name
    clone.value = (el as HTMLInputElement).value ?? ''
    clone.dataset.actionBindClone = name
    form.appendChild(clone)

    const sync = (): void => { clone.value = (el as HTMLInputElement).value }
    el.addEventListener('change', sync)
    el.addEventListener('input', sync)
    bindRegistry.set(el, { clone, sync })
  })
}
