/** HTML genérico que se inyecta cuando la carga de la vista parcial falla. */
export function modalErrorTemplate(): string {
  return `
    <div class="flex flex-col items-center justify-center gap-3 py-10 px-6 text-center">
      <div class="flex items-center justify-center w-14 h-14 rounded-full bg-red-100">
        <span class="material-symbols-outlined text-3xl! text-red-500">error</span>
      </div>
      <div>
        <p class="text-sm font-semibold text-gray-800">No se pudo cargar el contenido</p>
        <p class="text-xs text-gray-500 mt-1">Verifica tu conexión e intenta de nuevo.</p>
      </div>
      <button type="button" onclick="this.closest('dialog').close()"
        class="btn btn-sm btn-ghost text-gray-500">
        Cerrar
      </button>
    </div>`
}
