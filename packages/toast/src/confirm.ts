import type { ToastType } from '@/types'
import { PALETTE, ICON } from '@/const'

export interface ConfirmOptions {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  /** Tipo visual (color del badge y del botón confirmar). Default: `warning`. */
  type?: Extract<ToastType, 'warning' | 'error' | 'info' | 'success'>
}

const CONFIRM_CSS = `
  ._confirm-dlg {
    border: none;
    padding: 0;
    background: transparent;
    max-width: 100vw;
    max-height: 100dvh;
    font-family: Inter, "Segoe UI", Roboto, Arial, sans-serif;
  }
  ._confirm-dlg::backdrop {
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.18s ease;
  }
  ._confirm-dlg[open]::backdrop { opacity: 1; }
  @starting-style { ._confirm-dlg[open]::backdrop { opacity: 0; } }

  ._confirm-card {
    width: min(380px, calc(100vw - 32px));
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.07), 0 18px 40px rgba(0,0,0,0.18);
    padding: 22px 22px 18px;
    box-sizing: border-box;
    text-align: center;
    animation: _confirm-in 0.2s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @keyframes _confirm-in {
    from { opacity: 0; transform: translateY(8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  [data-theme='dark'] ._confirm-card { background: #151617; }

  ._confirm-badge {
    width: 46px; height: 46px;
    margin: 0 auto 12px;
    border-radius: 999px;
    border: 1px solid transparent;
    display: flex; align-items: center; justify-content: center;
  }
  ._confirm-badge svg { width: 22px; height: 22px; }

  ._confirm-title {
    margin: 0 0 6px;
    font-size: 16px; font-weight: 700; color: #1f2937;
  }
  [data-theme='dark'] ._confirm-title { color: #f3f4f6; }

  ._confirm-msg {
    margin: 0 0 18px;
    font-size: 13.5px; line-height: 1.45; font-weight: 500; color: #5b6370;
  }
  [data-theme='dark'] ._confirm-msg { color: #a5aab3; }

  ._confirm-actions { display: flex; gap: 8px; }
  ._confirm-btn {
    flex: 1;
    padding: 9px 14px;
    border-radius: 12px;
    border: none;
    font-size: 13.5px; font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: filter 0.15s ease, background 0.15s ease;
  }
  ._confirm-btn-cancel { background: #eef0f3; color: #374151; }
  ._confirm-btn-cancel:hover { background: #e3e6ea; }
  [data-theme='dark'] ._confirm-btn-cancel { background: #2a2c2f; color: #e5e7eb; }
  ._confirm-btn-ok { color: #fff; }
  ._confirm-btn-ok:hover { filter: brightness(1.06); }
`

function mountConfirmStyles(): void {
  if (document.getElementById('_confirm-css')) return
  const style = document.createElement('style')
  style.id = '_confirm-css'
  style.textContent = CONFIRM_CSS
  document.head.appendChild(style)
}

/**
 * Muestra un diálogo de confirmación con el mismo lenguaje visual que los toasts.
 * Resuelve a `true` si el usuario confirma, `false` si cancela / cierra.
 */
export function confirm(options: ConfirmOptions = {}): Promise<boolean> {
  const {
    title = '¿Estás seguro?',
    message = 'Esta acción no se puede deshacer.',
    confirmText = 'Sí, continuar',
    cancelText = 'Cancelar',
    type = 'warning',
  } = options

  mountConfirmStyles()
  const palette = PALETTE[type]

  const dlg = document.createElement('dialog')
  dlg.className = '_confirm-dlg'
  dlg.innerHTML = `
    <div class="_confirm-card" role="alertdialog" aria-modal="true">
      <div class="_confirm-badge" style="color:${palette.icon};background:${palette.iconBg};border-color:${palette.iconBorder}">
        ${ICON[type]}
      </div>
      <h3 class="_confirm-title"></h3>
      <p class="_confirm-msg"></p>
      <div class="_confirm-actions">
        <button type="button" class="_confirm-btn _confirm-btn-cancel" data-cancel></button>
        <button type="button" class="_confirm-btn _confirm-btn-ok" data-ok style="background:${palette.icon}"></button>
      </div>
    </div>`

  dlg.querySelector<HTMLElement>('._confirm-title')!.textContent = title
  dlg.querySelector<HTMLElement>('._confirm-msg')!.textContent = message
  dlg.querySelector<HTMLElement>('[data-cancel]')!.textContent = cancelText
  dlg.querySelector<HTMLElement>('[data-ok]')!.textContent = confirmText

  document.body.appendChild(dlg)
  dlg.showModal()

  return new Promise<boolean>(resolve => {
    let settled = false
    const close = (result: boolean): void => {
      if (settled) return
      settled = true
      resolve(result)
      dlg.close()
      dlg.remove()
    }

    dlg.querySelector<HTMLButtonElement>('[data-ok]')!.addEventListener('click', () => close(true))
    dlg.querySelector<HTMLButtonElement>('[data-cancel]')!.addEventListener('click', () => close(false))
    // Click en el backdrop (fuera de la tarjeta) = cancelar.
    dlg.addEventListener('click', e => {
      if (e.target === dlg) close(false)
    })
    // ESC.
    dlg.addEventListener('cancel', e => {
      e.preventDefault()
      close(false)
    })
  })
}
