import type { ToastType } from '@/types'
import { PALETTE, ICON } from '@/const'

export interface NotifyOptions {
  title?: string
  message?: string
  confirmText?: string
  /** Tipo visual (color del backdrop y del badge). Default: `success`. */
  type?: Extract<ToastType, 'warning' | 'error' | 'info' | 'success'>
}

/** Colores semitransparentes del backdrop por tipo. */
const BACKDROP_COLOR: Record<string, string> = {
  success: 'rgba(34, 197, 94, 0.22)',
  error:   'rgba(255, 68, 59, 0.22)',
  warning: 'rgba(245, 158, 11, 0.22)',
  info:    'rgba(96, 165, 250, 0.22)',
}

const NOTIFY_CSS = `
  ._notify-dlg {
    border: none;
    padding: 0;
    background: transparent;
    max-width: 100vw;
    max-height: 100dvh;
    margin: auto;
    font-family: Inter, "Segoe UI", Roboto, Arial, sans-serif;
  }
  ._notify-dlg::backdrop {
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  ._notify-dlg[open]::backdrop { opacity: 1; }
  @starting-style { ._notify-dlg[open]::backdrop { opacity: 0; } }

  ._notify-card {
    width: min(360px, calc(100vw - 32px));
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.07), 0 20px 48px rgba(0,0,0,0.18);
    padding: 28px 24px 22px;
    box-sizing: border-box;
    text-align: center;
    animation: _notify-in 0.22s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @keyframes _notify-in {
    from { opacity: 0; transform: translateY(10px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  [data-theme='dark'] ._notify-card { background: #151617; }

  ._notify-badge {
    width: 68px; height: 68px;
    margin: 0 auto 16px;
    border-radius: 999px;
    border: 2px solid transparent;
    display: flex; align-items: center; justify-content: center;
  }
  ._notify-badge svg { width: 32px; height: 32px; }

  ._notify-title {
    margin: 0 0 8px;
    font-size: 18px; font-weight: 700; color: #1f2937;
  }
  [data-theme='dark'] ._notify-title { color: #f3f4f6; }

  ._notify-msg {
    margin: 0 0 22px;
    font-size: 14px; line-height: 1.5; font-weight: 500; color: #5b6370;
  }
  [data-theme='dark'] ._notify-msg { color: #a5aab3; }

  ._notify-btn {
    width: 100%;
    padding: 10px 16px;
    border-radius: 12px;
    border: none !important;
    outline: none;
    box-shadow: none;
    font-size: 14px; font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    color: #fff !important;
    transition: filter 0.15s ease;
  }
  ._notify-btn:hover { filter: brightness(1.08); }
  ._notify-btn:focus { outline: none; box-shadow: none; }
`

function mountNotifyStyles(): void {
  if (document.getElementById('_notify-css')) return
  const style = document.createElement('style')
  style.id = '_notify-css'
  style.textContent = NOTIFY_CSS
  document.head.appendChild(style)
}

/**
 * Muestra una notificación de pantalla completa con backdrop de color.
 * Un solo botón — el usuario debe aceptar para cerrar.
 * Resuelve cuando el usuario hace click en Aceptar, en el backdrop o presiona ESC.
 */
export function notify(options: NotifyOptions = {}): Promise<void> {
  const {
    title = 'Éxito',
    message = '',
    confirmText = 'Aceptar',
    type = 'success',
  } = options

  mountNotifyStyles()
  const palette = PALETTE[type]
  const backdropColor = BACKDROP_COLOR[type]

  const dlg = document.createElement('dialog')
  dlg.className = '_notify-dlg'

  // El backdrop no acepta variables CSS directamente — se inyecta una regla dinámica.
  const backdropId = `_notify-backdrop-${Math.random().toString(36).slice(2)}`
  dlg.dataset.backdropId = backdropId
  const backdropStyle = document.createElement('style')
  backdropStyle.id = backdropId
  backdropStyle.textContent = `
    ._notify-dlg[data-backdrop-id="${backdropId}"]::backdrop {
      background: ${backdropColor};
      backdrop-filter: blur(2px);
    }
  `
  document.head.appendChild(backdropStyle)

  dlg.innerHTML = `
    <div class="_notify-card" role="alertdialog" aria-modal="true" aria-live="assertive">
      <div class="_notify-badge" style="color:${palette.icon};background:${palette.iconBg};border-color:${palette.iconBorder}">
        ${ICON[type]}
      </div>
      <h3 class="_notify-title" style="color:${palette.title}"></h3>
      <p class="_notify-msg"></p>
      <button type="button" class="_notify-btn" data-ok style="background:${palette.icon}"></button>
    </div>`

  dlg.querySelector<HTMLElement>('._notify-title')!.textContent = title
  dlg.querySelector<HTMLElement>('._notify-msg')!.textContent = message
  dlg.querySelector<HTMLElement>('[data-ok]')!.textContent = confirmText

  document.body.appendChild(dlg)
  dlg.showModal()

  return new Promise<void>(resolve => {
    let settled = false
    const close = (): void => {
      if (settled) return
      settled = true
      resolve()
      dlg.close()
      dlg.remove()
      backdropStyle.remove()
    }

    dlg.querySelector<HTMLButtonElement>('[data-ok]')!.addEventListener('click', close)
    dlg.addEventListener('click', e => { if (e.target === dlg) close() })
    dlg.addEventListener('cancel', e => { e.preventDefault(); close() })
  })
}
