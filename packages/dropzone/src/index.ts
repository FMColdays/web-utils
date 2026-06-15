/**
 * @fmcoldays/dropzone
 *
 * Zona de carga de archivos con drag & drop, previsualización, lightbox de
 * imágenes y subida inmediata opcional. Se auto-inicializa vía MutationObserver,
 * así que funciona en modales y partiales AJAX.
 *
 * Uso típico: basta importar el paquete una vez al arrancar la app.
 *
 *   import '@fmcoldays/dropzone'
 */
import { registerDropzone } from '@/register'

export * from '@/types'
export * from '@/const'
export * from '@/utils'
export { initDropzone } from '@/init-dropzone'
export { initAllDropzones, registerDropzone } from '@/register'

// Auto-registro al importar (idempotente).
registerDropzone()
