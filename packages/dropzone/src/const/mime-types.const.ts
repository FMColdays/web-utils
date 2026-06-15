/** Mapa de extensiones (sin punto) a su MIME type. */
export const EXT_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  pdf: 'application/pdf',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  csv: 'text/csv',
  txt: 'text/plain',
}

/** Ícono (material-symbols) por extensión en mayúsculas, para archivos no-imagen. */
export const EXT_ICON: Record<string, string> = {
  PDF: 'picture_as_pdf',
  XLS: 'table_chart',
  XLSX: 'table_chart',
  CSV: 'table_chart',
}
