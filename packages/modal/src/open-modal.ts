import {
  initStepForm,
  initFooterSubmit,
  renderLayout,
  parseUnobtrusiveForms,
  buildFetchOptions,
  runScripts,
} from '@/utils'
import { getModalConfig } from '@/config'
import { modalErrorTemplate } from '@/templates'
import type { ModalOptions } from '@/types'

const LOADING_OVERLAY_ID = 'fmc-modal-loading'

function showBuiltInLoading(html: string): void {
  let el = document.getElementById(LOADING_OVERLAY_ID)
  if (!el) {
    el = document.createElement('div')
    el.id = LOADING_OVERLAY_ID
    el.className = 'fmc-modal-loading'
    document.body.appendChild(el)
  }
  el.innerHTML = html
  el.style.display = 'flex'
}

function hideBuiltInLoading(): void {
  const el = document.getElementById(LOADING_OVERLAY_ID)
  if (el) el.style.display = 'none'
}

/**
 * Abre el modal cargando la vista parcial desde `url` vía fetch.
 *
 * El loading es de **pantalla completa** y el modal se abre cuando llega el
 * contenido (no se ve vacío). Estrategia de loading, en prioridad:
 * 1. `onLoadingStart`/`onLoadingEnd` → overlay externo.
 * 2. `loadingSelector` → muestra/oculta tu propio elemento full-screen.
 * 3. Por defecto → overlay integrado del paquete.
 */
export function openModal(url: string, opts: ModalOptions = {}): void {
  const cfg = getModalConfig()

  const container = document.querySelector<HTMLElement>(cfg.body)
  const modal = document.querySelector<HTMLDialogElement>(cfg.dialog)
  if (!modal || !container) {
    console.error('No se encontró el modal en el DOM. Revisa el selector:', cfg.dialog)
    return
  }

  const userLoading = cfg.loadingSelector
    ? document.querySelector<HTMLElement>(cfg.loadingSelector)
    : null

  if (typeof cfg.onLoadingStart === 'function') cfg.onLoadingStart()
  else if (userLoading) userLoading.style.display = 'flex'
  else showBuiltInLoading(cfg.loadingTemplate())

  const finishLoading = (): void => {
    if (typeof cfg.onLoadingEnd === 'function') cfg.onLoadingEnd()
    else if (userLoading) userLoading.style.display = 'none'
    else hideBuiltInLoading()
  }

  const { url: fetchUrl, init } = buildFetchOptions(url, opts)

  fetch(fetchUrl, init)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.text()
    })
    .then((html) => {
      finishLoading()
      container.innerHTML = html
      runScripts(container)
      parseUnobtrusiveForms(container)
      renderLayout(container)
      initStepForm(container)
      initFooterSubmit(container)
      modal.showModal()
    })
    .catch(() => {
      finishLoading()
      container.innerHTML = modalErrorTemplate()
      modal.showModal()
    })
}
