import type { ActionOptions } from '@/types'

/**
 * Lee los atributos `data-action-*` de un trigger y los normaliza en un
 * objeto {@link ActionOptions}. Devuelve `null` si falta `data-action-url`.
 */
export function parseOptions(trigger: HTMLElement, fallback?: { url?: string; method?: string }): ActionOptions | null {
  const url = trigger.dataset.actionUrl ?? fallback?.url
  if (!url) return null

  return {
    url,
    method: trigger.dataset.actionMethod ?? fallback?.method ?? 'POST',
    silent: trigger.dataset.actionSilent === 'true',
    reloadOnSuccess: trigger.dataset.actionReload === 'true',
    redirect: trigger.dataset.actionRedirect,
    successMsg: trigger.dataset.actionSuccessMsg ?? 'La operación se completó exitosamente.',
    errorMsg: trigger.dataset.actionErrorMsg ?? 'Ocurrió un error al realizar la operación.',
    confirm: trigger.dataset.actionConfirm === 'true',
    confirmTitle: trigger.dataset.actionConfirmTitle ?? '¿Estás seguro?',
    confirmDescription: trigger.dataset.actionConfirmDescription ?? 'Esta acción no se puede deshacer.',
    bodyJson: trigger.dataset.actionBody,
    bodyForm: trigger.dataset.actionBodyForm,
    pick: (() => {
      const raw = trigger.dataset.actionPick
      if (!raw) return undefined
      try {
        return JSON.parse(raw) as Record<string, string>
      } catch {
        return undefined
      }
    })(),
    disable: trigger.dataset.actionDisable === 'true',
    loadingClass: trigger.dataset.actionLoadingClass,
    targetSel: trigger.dataset.actionTarget,
    targetProp: (trigger.dataset.actionTargetProp ?? 'html') as ActionOptions['targetProp'],
    thenSel: trigger.dataset.actionThen,
    csrf: trigger.dataset.actionCsrf === 'true',
    download: trigger.dataset.actionDownload === 'true',
    dismiss: trigger.dataset.actionDismiss === 'false' ? false : trigger.dataset.actionDismiss,
  }
}
