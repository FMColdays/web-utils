/**
 * Habilita arrastrar el modal desde el grip `#modal-grab` y enlaza el botón
 * `#modalCerrar`. Limita el movimiento al viewport y resetea la posición al
 * cerrar. Idempotente (marca `data-fmc-drag-init` en el `<dialog>`).
 */
export function initModalDrag(dialog: HTMLDialogElement): void {
  if (dialog.dataset.fmcDragInit === '1') return

  const contenedor = dialog.querySelector<HTMLElement>('.modal__contenedor')
  if (!contenedor) return

  dialog.dataset.fmcDragInit = '1'

  const grab = contenedor.querySelector<HTMLElement>('#modal-grab')
  const btnX = dialog.querySelector<HTMLElement>('#modalCerrar')

  let dragging = false
  let startX = 0
  let startY = 0
  let dx = 0
  let dy = 0
  let rafId: number | null = null

  const applyTransform = (): void => {
    contenedor.style.setProperty('--dx', `${dx}px`)
    contenedor.style.setProperty('--dy', `${dy}px`)
    rafId = null
  }

  const clampToViewport = (nx: number, ny: number): { x: number; y: number } => {
    const rect = contenedor.getBoundingClientRect()
    const baseLeft = rect.left - dx
    const baseTop = rect.top - dy
    return {
      x: Math.max(-baseLeft, Math.min(nx, window.innerWidth - rect.width - baseLeft)),
      y: Math.max(-baseTop, Math.min(ny, window.innerHeight - rect.height - baseTop)),
    }
  }

  const onPointerMove = (e: PointerEvent): void => {
    if (!dragging) return
    const clamped = clampToViewport(e.clientX - startX, e.clientY - startY)
    dx = clamped.x
    dy = clamped.y
    if (rafId == null) rafId = requestAnimationFrame(applyTransform)
  }

  const endDrag = (e: PointerEvent): void => {
    if (!dragging) return
    dragging = false
    try { contenedor.releasePointerCapture(e.pointerId) } catch { /* noop */ }
    document.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerup', endDrag)
    document.removeEventListener('pointercancel', endDrag)
  }

  const startDrag = (e: PointerEvent): void => {
    e.preventDefault()
    dragging = true
    try { contenedor.setPointerCapture(e.pointerId) } catch { /* noop */ }
    startX = e.clientX - dx
    startY = e.clientY - dy
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', endDrag)
    document.addEventListener('pointercancel', endDrag)
  }

  grab?.addEventListener('pointerdown', startDrag)

  window.addEventListener('resize', () => {
    const clamped = clampToViewport(dx, dy)
    dx = clamped.x
    dy = clamped.y
    applyTransform()
  })

  btnX?.addEventListener('click', () => dialog.close())
  dialog.addEventListener('close', () => {
    dx = 0
    dy = 0
    applyTransform()
  })
}
