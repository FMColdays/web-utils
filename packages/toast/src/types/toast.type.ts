export type ToastType = 'success' | 'error' | 'warning' | 'info'

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export interface ToastOptions {
  description?: string
  duration?: number
  position?: ToastPosition
}

export interface ToastConfiguration {
  position?: ToastPosition
  bottomOffset?: number
  mobileBottomOffset?: number
  mobileBreakpoint?: number
  mobileSideGap?: number
}

export type ToastSide = 'top' | 'bottom'
export type ToastAlign = 'left' | 'center' | 'right'
