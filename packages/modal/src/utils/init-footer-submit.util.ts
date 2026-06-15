/**
 * Enlaza el botón submit que vive en el slot del footer (fuera del `<form>`)
 * con la validación del formulario. Se omite en formularios multi-paso, que
 * gestionan su propio submit en {@link initStepForm}.
 *
 * jQuery Validate (`.valid()`) se accede vía `window.jQuery` si el proyecto
 * anfitrión lo carga; si no está presente, se omite la validación client-side
 * y el navegador aplica su validación nativa (required, pattern, etc.).
 */
export const initFooterSubmit = (container: HTMLElement): void => {
  const form = container.querySelector<HTMLFormElement>('form')
  if (!form) return
  if (form.hasAttribute('data-step-form')) return

  const slotFooter = document.querySelector('[data-modal-slot="footer"]')
  if (!slotFooter) return

  slotFooter
    .querySelectorAll<HTMLButtonElement>('button:not([type="button"]):not([type="reset"])')
    .forEach((btn) => {
      btn.addEventListener('click', (e) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const jq = (window as any).jQuery
        if (btn.getAttribute('form')) {
          if (jq && jq(form).valid?.() === false) e.preventDefault()
          return
        }
        e.preventDefault()
        if (!jq || jq(form).valid?.() !== false) form.requestSubmit()
      })
    })
}
