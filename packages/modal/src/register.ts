import { openModal } from '@/open-modal'
import { ensureModalShell, initModalDrag } from '@/utils'
import { getModalConfig } from '@/config'
import type { ModalOptions } from '@/types'

/** Handler de click: abre el modal para el trigger más cercano con `data-modal-url`. */
function handleModalClick(e: MouseEvent): void {
  const target = e.target as HTMLElement

  // Cierre declarativo: cualquier elemento con data-modal-close cierra el modal.
  const closer = target.closest<HTMLElement>('[data-modal-close]')
  if (closer) {
    e.preventDefault()
    document.querySelector<HTMLDialogElement>(getModalConfig().dialog)?.close()
    return
  }

  const trigger = target.closest<HTMLElement>('[data-modal-url]')
  if (!trigger) return

  e.preventDefault()

  const url = trigger.dataset.modalUrl
  if (!url) {
    console.error('El elemento tiene data-modal-url pero no tiene un valor válido:', trigger)
    return
  }

  let pick: Record<string, string> | undefined
  if (trigger.dataset.modalPick) {
    try {
      pick = JSON.parse(trigger.dataset.modalPick) as Record<string, string>
    } catch {
      /* JSON inválido, ignorar */
    }
  }

  const opts: ModalOptions = {
    method: trigger.dataset.modalMethod,
    bodyJson: trigger.dataset.modalBody,
    bodyForm: trigger.dataset.modalBodyForm,
    csrf: trigger.dataset.modalCsrf === 'true',
    pick,
  }

  openModal(url, opts)
}

/** Inyecta el shell (si falta) e inicializa el arrastre. Requiere `document.body`. */
function setupShell(): void {
  ensureModalShell()
  const dialog = document.querySelector<HTMLDialogElement>(getModalConfig().dialog)
  if (dialog) initModalDrag(dialog)
}

/**
 * Registra el listener global de `modal` (event delegation), expone
 * `window.openModal`, inyecta el `<dialog>` si no existe e inicializa el
 * arrastre. Idempotente. Devuelve una función para desregistrar el listener.
 */
export function registerModal(root: Document | HTMLElement = document): () => void {
  root.removeEventListener('click', handleModalClick as EventListener)
  root.addEventListener('click', handleModalClick as EventListener)
  window.openModal = openModal

  if (document.body) setupShell()
  else document.addEventListener('DOMContentLoaded', setupShell, { once: true })

  return () => root.removeEventListener('click', handleModalClick as EventListener)
}
