/**
 * Habilita el wizard multi-paso de un `<form data-step-form>`: navega entre
 * bloques `[data-step="N"]`, valida el paso actual antes de avanzar, actualiza
 * el indicador `[data-step-item]` y muestra/oculta los botones prev/next/submit
 * del footer. No hace nada si hay un solo paso.
 *
 * jQuery Validate (`.data('validator')`, `.valid()`) se accede vía
 * `window.jQuery` si el proyecto anfitrión lo carga; sin él, la navegación
 * entre pasos procede sin validación client-side intermedia.
 */
export const initStepForm = (container: HTMLElement): void => {
  const form = container.querySelector<HTMLFormElement>('[data-step-form]')
  if (!form) return

  const steps = Array.from(form.children).filter((el) =>
    el.hasAttribute('data-step')
  ) as HTMLElement[]
  if (steps.length <= 1) return

  const totalSteps = steps.length
  let currentStep = 1

  const slotFooter = document.querySelector('[data-modal-slot="footer"]')
  const slotSteps = document.querySelector('[data-modal-slot="steps"]')

  const prevBtn = slotFooter?.querySelector<HTMLElement>('[data-step-prev]') ?? null
  const nextBtn = slotFooter?.querySelector<HTMLElement>('[data-step-next]') ?? null
  const submitBtn = slotFooter?.querySelector<HTMLElement>('[data-step-submit]') ?? null

  const clampStep = (s: number): number => Math.max(1, Math.min(s, totalSteps))

  const updateIndicator = (step: number): void => {
    if (!slotSteps) return
    slotSteps.querySelectorAll('[data-step-item]').forEach((el) => {
      const n = parseInt(el.getAttribute('data-step-item') ?? '0')
      el.classList.toggle('step-primary', n <= step)
    })
  }

  const showStep = (step: number): void => {
    currentStep = clampStep(step)
    steps.forEach((el) => {
      const n = parseInt(el.getAttribute('data-step') ?? '0')
      el.classList.toggle('hidden', n !== currentStep)
    })
    prevBtn?.classList.toggle('hidden', currentStep <= 1)
    nextBtn?.classList.toggle('hidden', currentStep >= totalSteps)
    submitBtn?.classList.toggle('hidden', currentStep !== totalSteps)
    updateIndicator(currentStep)
  }

  nextBtn?.addEventListener('click', (e) => {
    e.preventDefault()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jq = (window as any).jQuery
    if (jq) {
      const validator = jq(form).data('validator') as
        | { element(el: HTMLElement): boolean }
        | undefined
      if (validator) {
        const fields = Array.from(
          form.querySelectorAll<HTMLElement>(
            `[data-step="${currentStep}"] input[name], [data-step="${currentStep}"] select[name], [data-step="${currentStep}"] textarea[name]`
          )
        )
        if (fields.some((el) => !validator.element(el))) return
      }
    }
    if (currentStep < totalSteps) showStep(currentStep + 1)
  })

  prevBtn?.addEventListener('click', (e) => {
    e.preventDefault()
    if (currentStep > 1) showStep(currentStep - 1)
  })

  submitBtn?.addEventListener('click', (e) => {
    e.preventDefault()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jq = (window as any).jQuery
    if (!jq || jq(form).valid?.() !== false) form.requestSubmit()
  })

  showStep(1)
}
