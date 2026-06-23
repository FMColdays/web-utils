import { handlePostActionClick } from '@/handle-post-action-click'
import { handlePostActionSubmit } from '@/handle-post-action-submit'
import { handleActionSubmitTrigger } from '@/handle-action-submit-trigger'
import { handlePostActionSelectChange } from '@/handle-post-action-select-change'
import { bindElements } from '@/bind-elements'

type JQueryLike = (el: unknown) => {
  on(events: string, selector: string, handler: (this: HTMLElement) => void): void
}

/** Devuelve true si el select está gestionado por Select2. */
function isSelect2(el: HTMLElement): boolean {
  return el.hasAttribute('data-select2-id')
}

/**
 * Registra el bridge de jQuery/Select2. Debe llamarse una sola vez porque
 * `$(document).on(...)` usa event delegation y cubre elementos futuros.
 */
let select2BridgeRegistered = false
function setupSelect2Bridge(): void {
  if (select2BridgeRegistered) return
  const $ = (window as { $?: JQueryLike }).$
  if (typeof $ !== 'function') return

  // data-action-submit en selects de Select2 → requestSubmit() en el form padre
  $(document).on('select2:select select2:unselect', '[data-action-submit]', function () {
    const sel = this.dataset.actionSubmit
    const form = sel
      ? document.querySelector<HTMLFormElement>(sel)
      : this.closest<HTMLFormElement>('form')
    form?.requestSubmit()
  })

  // select[data-action="true"] con Select2 → handlePostActionSelectChange
  $(document).on('select2:select select2:unselect', 'select[data-action="true"]', function () {
    void handlePostActionSelectChange(this as HTMLSelectElement)
  })

  select2BridgeRegistered = true
}

const clickListener: EventListener = (e) => { void handlePostActionClick(e as MouseEvent) }
const submitListener: EventListener = (e) => { void handlePostActionSubmit(e) }

// change: maneja data-action-submit Y select[data-action="true"], saltando Select2
// (Select2 tiene su propio bridge vía jQuery)
const changeListener: EventListener = (e) => {
  const target = e.target as HTMLElement
  if (isSelect2(target)) return
  handleActionSubmitTrigger(e)
  if (target instanceof HTMLSelectElement && target.dataset.action === 'true') {
    void handlePostActionSelectChange(target)
  }
}

const inputListener: EventListener = (e) => { handleActionSubmitTrigger(e) }

function whenReady(fn: () => void): void {
  if (document.readyState !== 'loading') fn()
  else document.addEventListener('DOMContentLoaded', fn, { once: true })
}

let updatedListener: (() => void) | null = null

export function registerPostAction(root: Document | HTMLElement = document): () => void {
  whenReady(() => { bindElements(root); setupSelect2Bridge() })

  if (updatedListener) root.removeEventListener('post-action:updated', updatedListener)
  updatedListener = () => { bindElements(root); setupSelect2Bridge() }
  root.addEventListener('post-action:updated', updatedListener)

  root.removeEventListener('click', clickListener)
  root.addEventListener('click', clickListener)

  root.removeEventListener('change', changeListener)
  root.addEventListener('change', changeListener)

  root.removeEventListener('input', inputListener)
  root.addEventListener('input', inputListener)

  // Capture phase: interceptar submit antes de la validación nativa del browser
  root.removeEventListener('submit', submitListener, true)
  root.addEventListener('submit', submitListener, true)

  return () => {
    if (updatedListener) root.removeEventListener('post-action:updated', updatedListener)
    root.removeEventListener('click', clickListener)
    root.removeEventListener('change', changeListener)
    root.removeEventListener('input', inputListener)
    root.removeEventListener('submit', submitListener, true)
  }
}
