/**
 * @fmcoldays/shared
 *
 * Barril raíz del paquete. Reexporta cada submódulo a través de su propio
 * barril, de modo que el consumidor importe todo desde la raíz:
 *
 *   import { buildHttpPayload, showSpinner, type ApiResponse } from '@fmcoldays/shared'
 */
export * from '@/types'
export * from '@/const'
export * from '@/dom'
export * from '@/http'
export * from '@/format'
