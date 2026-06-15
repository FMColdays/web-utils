/** Resultado de ejecutar la petición de un `post-action`. */
export interface ActionResult {
  ok: boolean
  response: Response | null
  serverMsg?: string
}
