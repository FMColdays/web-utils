/** Opciones resueltas desde los atributos `data-*` del contenedor `[data-dropzone]`. */
export interface DropzoneOptions {
  acceptedFiles: string[]
  maxFilesize: number
  maxFiles: number
  label: string
  uploadUrl: string | null
  uploadParam: string | null
  target: string | null
  /** Selector del input donde se escribe la latitud al agregar un archivo. */
  geoLatSelector: string | null
  /** Selector del input donde se escribe la longitud al agregar un archivo. */
  geoLngSelector: string | null
  /** Si `true`, muestra un mensaje visible al obtener (o fallar) la ubicación. */
  geoNotify: boolean
}

/** Cambia el estado visual de un item de preview. */
export type StatusSetter = (state: 'uploading' | 'success' | 'error') => void
