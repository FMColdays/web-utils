/**
 * Re-parsea la validación unobtrusive de MVC sobre los formularios recién
 * inyectados. Quita el validator existente antes de re-parsear para evitar que
 * `parse()` acumule handlers y produzca doble submit.
 *
 * No importa jQuery como módulo — lo accede vía `window.jQuery` si el proyecto
 * anfitrión lo carga (ASP.NET MVC lo hace normalmente). Sin jQuery presente,
 * la función es un no-op.
 */
export const parseUnobtrusiveForms = (container: HTMLElement): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jq = (window as any).jQuery
  if (!jq?.validator?.unobtrusive) return
  container.querySelectorAll('form').forEach((form) => {
    jq(form).removeData('validator').removeData('unobtrusiveValidation')
    jq.validator.unobtrusive.parse(jq(form))
  })
}
