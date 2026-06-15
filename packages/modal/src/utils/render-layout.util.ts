/**
 * Extrae las secciones semánticas de la vista parcial cargada y las mueve a
 * sus slots fijos del modal:
 * - `[data-modal-header]`        → `[data-modal-slot="header"]`
 * - `[data-modal-footer]`        → `[data-modal-slot="footer"]`
 * - `[data-step-indicator]`      → `[data-modal-slot="steps"]`
 *
 * Antes de mover el footer, asigna `form=` a sus botones submit para que el
 * navegador los conecte al `<form>` aunque queden fuera de él.
 */
export const renderLayout = (container: HTMLElement): void => {
  const slotHeader = document.querySelector('[data-modal-slot="header"]')
  const slotFooter = document.querySelector('[data-modal-slot="footer"]')
  const slotSteps = document.querySelector('[data-modal-slot="steps"]')

  if (slotHeader) slotHeader.innerHTML = ''
  if (slotFooter) slotFooter.innerHTML = ''
  if (slotSteps) {
    slotSteps.innerHTML = ''
    slotSteps.classList.add('hidden')
  }

  const header = container.querySelector('[data-modal-header]')
  if (header) {
    const headerContent = header.outerHTML
    header.remove()
    if (slotHeader) slotHeader.innerHTML = headerContent
  }

  const footer = container.querySelector('[data-modal-footer]')
  if (footer) {
    const form = container.querySelector('form')
    if (form) {
      if (!form.id) form.id = `modal-form-${Math.random().toString(36).slice(2)}`
      footer
        .querySelectorAll<HTMLElement>('button[type="submit"], input[type="submit"]')
        .forEach((btn) => btn.setAttribute('form', form.id))
    }
    const footerContent = footer.outerHTML
    footer.remove()
    if (slotFooter) slotFooter.innerHTML = footerContent
  }

  const stepsEl = container.querySelector('[data-step-indicator]')
  if (stepsEl) {
    const stepsContent = stepsEl.outerHTML
    stepsEl.remove()
    if (slotSteps) {
      slotSteps.innerHTML = stepsContent
      slotSteps.classList.remove('hidden')
    }
  }
}
