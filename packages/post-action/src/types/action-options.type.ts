/** Opciones resueltas desde los atributos `data-action-*` de un trigger. */
export interface ActionOptions {
  url: string
  method: string
  silent: boolean | undefined
  reloadOnSuccess: boolean
  redirect?: string
  successMsg: string
  errorMsg: string
  confirm: boolean
  confirmTitle: string
  confirmDescription: string
  bodyJson?: string
  bodyForm?: string
  pick?: Record<string, string>
  disable: boolean
  loadingClass?: string
  targetSel?: string
  targetProp: 'html' | 'text' | 'value'
  thenSel?: string
  csrf: boolean
  download: boolean
  dismiss?: string | false
  formData?: FormData
  skeleton?: string | false
}
