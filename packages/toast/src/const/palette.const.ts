import type { ToastType } from '@/types'

/** Colores por tipo de notificación (título, ícono y fondo/borde del badge). */
export const PALETTE: Record<
  ToastType,
  { title: string; icon: string; iconBg: string; iconBorder: string }
> = {
  success: {
    title: '#22c55e',
    icon: '#22c55e',
    iconBg: 'rgba(34, 197, 94, 0.14)',
    iconBorder: 'rgba(34, 197, 94, 0.22)',
  },
  error: {
    title: '#ff443b',
    icon: '#ff443b',
    iconBg: 'rgba(255, 68, 59, 0.14)',
    iconBorder: 'rgba(255, 68, 59, 0.22)',
  },
  warning: {
    title: '#f59e0b',
    icon: '#f59e0b',
    iconBg: 'rgba(245, 158, 11, 0.14)',
    iconBorder: 'rgba(245, 158, 11, 0.22)',
  },
  info: {
    title: '#60a5fa',
    icon: '#60a5fa',
    iconBg: 'rgba(96, 165, 250, 0.14)',
    iconBorder: 'rgba(96, 165, 250, 0.22)',
  },
}

/** SVG (inline) del ícono por tipo. */
export const ICON: Record<ToastType, string> = {
  success: `
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="2.5 7.4 5.3 10.2 11.2 3.8"></polyline>
    </svg>
  `,
  error: `
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round">
      <line x1="3.7" y1="3.7" x2="10.3" y2="10.3"></line>
      <line x1="10.3" y1="3.7" x2="3.7" y2="10.3"></line>
    </svg>
  `,
  warning: `
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round">
      <line x1="7" y1="3.8" x2="7" y2="8.1"></line>
      <circle cx="7" cy="10.5" r="0.7" fill="currentColor" stroke="none"></circle>
    </svg>
  `,
  info: `
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round">
      <line x1="7" y1="6" x2="7" y2="10.4"></line>
      <circle cx="7" cy="3.4" r="0.7" fill="currentColor" stroke="none"></circle>
    </svg>
  `,
}
