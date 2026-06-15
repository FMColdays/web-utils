/**
 * Spinner integrado que se inyecta en el cuerpo del modal mientras carga la
 * vista parcial. Usa estilos inline + keyframes propios para no depender del
 * CSS de la app anfitriona. Sobrescribible vía `configureModal({ loadingTemplate })`.
 */
export function defaultLoadingTemplate(): string {
  return `
    <div style="display:flex;align-items:center;justify-content:center;padding:2.5rem;">
      <span style="width:2.5rem;height:2.5rem;border:3px solid #e5e7eb;border-top-color:#3b82f6;border-radius:50%;display:inline-block;animation:fmc-modal-spin .7s linear infinite;"></span>
    </div>
    <style>@keyframes fmc-modal-spin{to{transform:rotate(360deg)}}</style>`
}
