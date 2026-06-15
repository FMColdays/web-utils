import { modalShellTemplate } from '@/templates'
import { getModalConfig } from '@/config'

/**
 * Inyecta el `<dialog>` del modal en `document.body` si todavía no existe.
 * Respeta un `<dialog>` propio del usuario (si ya está en el DOM, no hace nada).
 */
export function ensureModalShell(): void {
  const cfg = getModalConfig()
  if (document.querySelector(cfg.dialog)) return

  const template = document.createElement('template')
  template.innerHTML = modalShellTemplate().trim()
  const dialog = template.content.firstElementChild
  if (dialog) document.body.appendChild(dialog)
}
