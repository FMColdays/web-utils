/**
 * Ejecuta los `<script>` dentro del HTML inyectado vía `innerHTML`.
 *
 * `innerHTML` parsea los scripts pero NO los ejecuta. Este helper los clona
 * como nodos nuevos — el browser sí los ejecuta al insertarlos en el DOM —
 * y reemplaza al original inerte.
 *
 * Soporta scripts inline y scripts con `src` (externos). Los scripts con
 * `type="module"` también se copian respetando su atributo.
 */
export function runScripts(container: HTMLElement): void {
  container.querySelectorAll('script').forEach((old) => {
    const next = document.createElement('script')
    Array.from(old.attributes).forEach((attr) => next.setAttribute(attr.name, attr.value))
    next.textContent = old.textContent
    old.parentNode?.replaceChild(next, old)
  })
}
