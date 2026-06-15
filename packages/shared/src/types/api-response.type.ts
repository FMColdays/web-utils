/** Respuesta genérica de la API. */
export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
}

/** Resultado genérico de una operación con archivo. */
export interface FileOperationResult {
  file: File
  response?: string
  error?: unknown
}
