/**
 * Markup del `<dialog>` que el paquete inyecta automáticamente si no existe.
 * Framework-agnóstico: el estilo vive en `modal.css` (import '@fmcoldays/modal/styles').
 *
 * Slots: header / steps / body / footer. Incluye grip de arrastre y botón cerrar.
 */
export function modalShellTemplate(): string {
  return `
<dialog id="dialog-form">
  <div class="modal__contenedor">
    <button id="modal-grab" type="button" class="fmc-modal-grab" aria-label="Mover">
      <svg width="22" height="10" viewBox="0 0 22 10" fill="currentColor" aria-hidden="true">
        <circle cx="4" cy="3" r="1.4"/><circle cx="11" cy="3" r="1.4"/><circle cx="18" cy="3" r="1.4"/>
        <circle cx="4" cy="7" r="1.4"/><circle cx="11" cy="7" r="1.4"/><circle cx="18" cy="7" r="1.4"/>
      </svg>
    </button>
    <button id="modalCerrar" type="button" class="fmc-modal-close" aria-label="Cerrar">&times;</button>

    <div data-modal-slot="header"></div>
    <div data-modal-slot="steps" class="hidden"></div>
    <div id="modal-body"></div>
    <div data-modal-slot="footer"></div>
  </div>
</dialog>`
}
