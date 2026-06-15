/** Formatea bytes a una cadena legible (Bytes, KB, MB). */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`
}

/**
 * Trunca un texto largo añadiendo "..." en el medio.
 * @example truncateText('This is a very long text…') // 'This is a very long...be truncated'
 */
export function truncateText(text: string, max = 35): string {
  if (text.length <= max) return text
  const half = Math.floor(max / 2)
  return text.slice(0, half) + '...' + text.slice(text.length - (max - half - 3))
}

/**
 * Trunca un nombre de archivo preservando la extensión.
 * @example truncateFileName('very_long_filename_document.pdf') // 'very_long_fi...ment.pdf'
 */
export function truncateFileName(name: string, max = 35): string {
  if (name.length <= max) return name
  const ext = name.slice(name.lastIndexOf('.'))
  const base = name.slice(0, name.lastIndexOf('.'))
  const len = max - ext.length - 3
  return len < 1 ? name.slice(0, max - 3) + '...' + ext : base.slice(0, len) + '...' + ext
}

/**
 * Obtiene la extensión de un nombre de archivo en mayúsculas (sin el punto).
 * @example getFileExt('document.pdf') // 'PDF'
 */
export function getFileExt(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toUpperCase()
}
