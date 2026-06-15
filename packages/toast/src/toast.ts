import type { ToastType, ToastPosition, ToastOptions, ToastConfiguration, ToastSide, ToastAlign } from '@/types'
import { PALETTE, ICON } from '@/const'

// ─── Configuración visual ─────────────────────────────────────────────────────

const MAX_DESKTOP_W = 392
const DESKTOP_EDGE_GAP = 16

const PILL_H = 48
const PILL_RADIUS = 18
const PILL_PAD_X = 20

const BODY_Y = 37
const BODY_RADIUS = 22

const ICON_W = 22
const HEADER_GAP = 9

const DESKTOP_MAX_PILL_W = 266
const DESKTOP_MIN_PILL_W = 205

const EXPAND_DELAY = 220
const EXPAND_DURATION = 470
const CONTENT_APPEAR_PROGRESS = 0.42

const settings = {
  position: 'top-center' as ToastPosition,
  bottomOffset: 16,
  mobileBottomOffset: 88,
  mobileBreakpoint: 640,
  mobileSideGap: 8,
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  ._toast-root {
    position: fixed;
    z-index: 99999;

    display: flex;
    flex-direction: column;
    gap: 10px;

    width: var(--toast-width);
    max-width: calc(100vw - (var(--toast-side-gap) * 2));

    pointer-events: none;

    --_toast-bg: #ffffff;
    --_toast-desc: #5b6370;
    --_toast-shadow-1: 0 2px 6px rgba(0, 0, 0, 0.07);
    --_toast-shadow-2: 0 12px 28px rgba(0, 0, 0, 0.12);
  }

  [data-theme='dark'] ._toast-root {
    --_toast-bg: #151617;
    --_toast-desc: #a5aab3;
    --_toast-shadow-1: 0 2px 6px rgba(0, 0, 0, 0.35);
    --_toast-shadow-2: 0 10px 22px rgba(0, 0, 0, 0.50);
  }

  ._toast-root[data-position='top-left'] {
    top: var(--toast-edge-gap);
    left: var(--toast-edge-gap);
    align-items: flex-start;
  }

  ._toast-root[data-position='top-center'] {
    top: var(--toast-edge-gap);
    left: 50%;
    transform: translateX(-50%);
    align-items: center;
  }

  ._toast-root[data-position='top-right'] {
    top: var(--toast-edge-gap);
    right: var(--toast-edge-gap);
    align-items: flex-end;
  }

  ._toast-root[data-position='bottom-left'] {
    bottom: var(--toast-bottom-offset);
    left: var(--toast-edge-gap);
    flex-direction: column-reverse;
    align-items: flex-start;
  }

  ._toast-root[data-position='bottom-center'] {
    bottom: var(--toast-bottom-offset);
    left: 50%;
    transform: translateX(-50%);
    flex-direction: column-reverse;
    align-items: center;
  }

  ._toast-root[data-position='bottom-right'] {
    bottom: var(--toast-bottom-offset);
    right: var(--toast-edge-gap);
    flex-direction: column-reverse;
    align-items: flex-end;
  }

  ._toast {
    position: relative;
    width: var(--toast-width);
    height: ${PILL_H}px;
    max-width: calc(100vw - (var(--toast-side-gap) * 2));

    pointer-events: auto;
    cursor: default;

    font-family: Inter, "Segoe UI", Roboto, Arial, sans-serif;

    filter:
      drop-shadow(var(--_toast-shadow-1))
      drop-shadow(var(--_toast-shadow-2));

    will-change: height, opacity, transform;
  }

  ._toast[data-side='top'] {
    transform-origin: top center;
    animation: _toast-in-top 280ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  ._toast[data-side='bottom'] {
    transform-origin: bottom center;
    animation: _toast-in-bottom 280ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  ._toast[data-side='top'].is-out {
    pointer-events: none;
    animation: _toast-out-top 180ms cubic-bezier(0.4, 0, 1, 1) both;
  }

  ._toast[data-side='bottom'].is-out {
    pointer-events: none;
    animation: _toast-out-bottom 180ms cubic-bezier(0.4, 0, 1, 1) both;
  }

  ._toast-svg {
    display: block;
    overflow: visible;
  }

  ._toast-svg [data-background] {
    fill: var(--_toast-bg);
  }

  ._toast-header {
    position: absolute;
    height: ${PILL_H}px;
    padding: 0 ${PILL_PAD_X}px;
    box-sizing: border-box;

    display: flex;
    align-items: center;
    justify-content: center;

    pointer-events: auto;
  }

  ._toast[data-side='top'] ._toast-header {
    top: 0;
  }

  ._toast[data-side='bottom'] ._toast-header {
    bottom: 0;
  }

  ._toast[data-align='left'] ._toast-header {
    left: 0;
  }

  ._toast[data-align='center'] ._toast-header {
    left: 50%;
    transform: translateX(-50%);
  }

  ._toast[data-align='right'] ._toast-header {
    right: 0;
  }

  ._toast-header-inner {
    width: 100%;
    min-width: 0;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${HEADER_GAP}px;
  }

  ._toast-badge {
    width: ${ICON_W}px;
    height: ${ICON_W}px;
    flex-shrink: 0;

    border-radius: 999px;
    border: 1px solid transparent;
    box-sizing: border-box;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  ._toast-badge svg {
    display: block;
    width: 11px;
    height: 11px;
  }

  ._toast-title {
    display: block;
    min-width: 0;
    max-width: none;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    font-size: 12.8px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0;
  }

  ._toast-title[data-truncated='true'] {
    cursor: help;
  }

  ._toast-content {
    position: absolute;
    left: 0;
    right: 0;

    display: block;
    width: 100%;
    max-width: none !important;
    min-width: 0;
    box-sizing: border-box;

    opacity: 0;

    transition:
      opacity 200ms ease,
      transform 260ms cubic-bezier(0.22, 1, 0.36, 1);

    pointer-events: none;
  }

  ._toast[data-side='top'] ._toast-content {
    top: ${BODY_Y}px;
    padding: 21px var(--toast-body-padding-x) 12px;
    transform: translateY(-7px);
  }

  ._toast[data-side='bottom'] ._toast-content {
    top: 0;
    padding: 12px var(--toast-body-padding-x) 21px;
    transform: translateY(7px);
  }

  ._toast.is-content-visible ._toast-content {
    opacity: 1;
    transform: translateY(0);
  }

  ._toast-desc {
    display: block;
    width: 100%;
    max-width: none !important;
    min-width: 0;

    margin: 0 !important;
    padding: 0 !important;

    color: var(--_toast-desc);
    font-size: 13.5px;
    font-weight: 500;
    line-height: 1.42;
    letter-spacing: 0;

    text-align: left;
    white-space: normal;
    word-break: normal;
    overflow-wrap: normal;
    text-wrap: wrap;
  }

  @keyframes _toast-in-top {
    0% {
      opacity: 0;
      transform: translateY(-10px) scale(0.985);
    }

    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes _toast-out-top {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    100% {
      opacity: 0;
      transform: translateY(-8px) scale(0.985);
    }
  }

  @keyframes _toast-in-bottom {
    0% {
      opacity: 0;
      transform: translateY(10px) scale(0.985);
    }

    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes _toast-out-bottom {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    100% {
      opacity: 0;
      transform: translateY(8px) scale(0.985);
    }
  }

  @media (max-width: 640px) {
    ._toast-desc {
      font-size: 12.25px;
      line-height: 1.4;
    }

    ._toast-title {
      font-size: 12.2px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    ._toast,
    ._toast.is-out,
    ._toast-content {
      animation: none !important;
      transition: none !important;
    }

    ._toast-content {
      opacity: 1;
      transform: none !important;
    }
  }
`

// ─── Estado ───────────────────────────────────────────────────────────────────

const roots = new Map<ToastPosition, HTMLElement>()
const activeLayouts = new Map<HTMLElement, () => void>()

let resizeMounted = false
let resizeFrame: number | undefined

// ─── Helpers generales ────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress
}

function easeOutCubic(progress: number): number {
  return 1 - Math.pow(1 - progress, 3)
}

function n(value: number): string {
  return value.toFixed(2)
}

function isMobile(): boolean {
  return window.innerWidth <= settings.mobileBreakpoint
}

function getSide(position: ToastPosition): ToastSide {
  return position.startsWith('bottom') ? 'bottom' : 'top'
}

function getAlign(position: ToastPosition): ToastAlign {
  if (position.endsWith('left')) {
    return 'left'
  }

  if (position.endsWith('right')) {
    return 'right'
  }

  return 'center'
}

function getResponsiveSideGap(): number {
  return isMobile() ? settings.mobileSideGap : DESKTOP_EDGE_GAP
}

function getResponsiveToastWidth(): number {
  const sideGap = getResponsiveSideGap()

  return Math.max(250, Math.min(MAX_DESKTOP_W, window.innerWidth - sideGap * 2))
}

function getBottomOffset(): number {
  return isMobile() ? settings.mobileBottomOffset : settings.bottomOffset
}

function getBodyPaddingX(toastWidth: number): number {
  return toastWidth < 340 ? 10 : 20
}

function getMaxPillWidth(toastWidth: number): number {
  const difference = toastWidth < 340 ? 62 : 96

  return Math.max(188, Math.min(DESKTOP_MAX_PILL_W, toastWidth - difference))
}

function getMinPillWidth(toastWidth: number): number {
  return Math.min(DESKTOP_MIN_PILL_W, getMaxPillWidth(toastWidth))
}

function getMaxTitleWidth(toastWidth: number): number {
  return Math.max(100, getMaxPillWidth(toastWidth) - PILL_PAD_X * 2 - ICON_W - HEADER_GAP)
}

function getPillX(align: ToastAlign, toastWidth: number, pillWidth: number): number {
  if (align === 'left') {
    return 0
  }

  if (align === 'right') {
    return toastWidth - pillWidth
  }

  return (toastWidth - pillWidth) / 2
}

function applyRootResponsiveStyles(root: HTMLElement, position: ToastPosition): void {
  const width = getResponsiveToastWidth()
  const sideGap = getResponsiveSideGap()
  const bottomOffset = getBottomOffset()
  const bodyPaddingX = getBodyPaddingX(width)

  root.dataset.position = position
  root.style.setProperty('--toast-width', `${width}px`)
  root.style.setProperty('--toast-side-gap', `${sideGap}px`)
  root.style.setProperty('--toast-edge-gap', `${sideGap}px`)
  root.style.setProperty('--toast-bottom-offset', `${bottomOffset}px`)
  root.style.setProperty('--toast-body-padding-x', `${bodyPaddingX}px`)
}

// ─── Paths SVG ────────────────────────────────────────────────────────────────

function createPillPath(pillX: number, pillWidth: number): string {
  const right = pillX + pillWidth

  return [
    `M ${n(pillX + PILL_RADIUS)} 0`,
    `H ${n(right - PILL_RADIUS)}`,
    `Q ${n(right)} 0 ${n(right)} ${n(PILL_RADIUS)}`,
    `V ${n(PILL_H - PILL_RADIUS)}`,
    `Q ${n(right)} ${n(PILL_H)} ${n(right - PILL_RADIUS)} ${n(PILL_H)}`,
    `H ${n(pillX + PILL_RADIUS)}`,
    `Q ${n(pillX)} ${n(PILL_H)} ${n(pillX)} ${n(PILL_H - PILL_RADIUS)}`,
    `V ${n(PILL_RADIUS)}`,
    `Q ${n(pillX)} 0 ${n(pillX + PILL_RADIUS)} 0`,
    'Z',
  ].join(' ')
}

function createCenteredExpandedPath(
  toastWidth: number,
  pillX: number,
  pillWidth: number,
  expandedHeight: number,
  progress: number,
): string {
  const pillRight = pillX + pillWidth

  const bodyLeft = lerp(pillX, 0, progress)
  const bodyRight = lerp(pillRight, toastWidth, progress)

  const bodyTop = lerp(PILL_H - 1, BODY_Y, progress)
  const bottom = lerp(PILL_H, expandedHeight, progress)

  const shoulderWidth = lerp(0, 17, progress)
  const shoulderRise = lerp(0, 10, progress)

  const availableBodyHeight = Math.max(0, bottom - bodyTop)
  const availableBodyWidth = Math.max(0, bodyRight - bodyLeft)

  const bodyRadius = Math.min(lerp(0, BODY_RADIUS, progress), availableBodyHeight / 2, availableBodyWidth / 2)

  const transitionY = bodyTop - shoulderRise

  return [
    `M ${n(pillX + PILL_RADIUS)} 0`,

    `H ${n(pillRight - PILL_RADIUS)}`,
    `Q ${n(pillRight)} 0 ${n(pillRight)} ${n(PILL_RADIUS)}`,

    `V ${n(transitionY)}`,
    `C ${n(pillRight)} ${n(bodyTop - 2)}, ${n(pillRight + shoulderWidth * 0.45)} ${n(bodyTop)}, ${n(pillRight + shoulderWidth)} ${n(bodyTop)}`,

    `H ${n(bodyRight - bodyRadius)}`,
    `Q ${n(bodyRight)} ${n(bodyTop)} ${n(bodyRight)} ${n(bodyTop + bodyRadius)}`,

    `V ${n(bottom - bodyRadius)}`,
    `Q ${n(bodyRight)} ${n(bottom)} ${n(bodyRight - bodyRadius)} ${n(bottom)}`,

    `H ${n(bodyLeft + bodyRadius)}`,
    `Q ${n(bodyLeft)} ${n(bottom)} ${n(bodyLeft)} ${n(bottom - bodyRadius)}`,

    `V ${n(bodyTop + bodyRadius)}`,
    `Q ${n(bodyLeft)} ${n(bodyTop)} ${n(bodyLeft + bodyRadius)} ${n(bodyTop)}`,

    `H ${n(pillX - shoulderWidth)}`,
    `C ${n(pillX - shoulderWidth * 0.45)} ${n(bodyTop)}, ${n(pillX)} ${n(bodyTop - 2)}, ${n(pillX)} ${n(transitionY)}`,

    `V ${n(PILL_RADIUS)}`,
    `Q ${n(pillX)} 0 ${n(pillX + PILL_RADIUS)} 0`,

    'Z',
  ].join(' ')
}

function createLeftExpandedPath(toastWidth: number, pillWidth: number, expandedHeight: number, progress: number): string {
  const pillRight = pillWidth

  const bodyRight = lerp(pillRight, toastWidth, progress)
  const bodyTop = lerp(PILL_H - 1, BODY_Y, progress)
  const bottom = lerp(PILL_H, expandedHeight, progress)

  const shoulderWidth = lerp(0, 17, progress)
  const shoulderRise = lerp(0, 10, progress)

  const availableBodyHeight = Math.max(0, bottom - bodyTop)

  const bodyRadius = Math.min(lerp(0, BODY_RADIUS, progress), availableBodyHeight / 2, bodyRight / 2)

  const transitionY = bodyTop - shoulderRise

  return [
    `M ${n(PILL_RADIUS)} 0`,

    `H ${n(pillRight - PILL_RADIUS)}`,
    `Q ${n(pillRight)} 0 ${n(pillRight)} ${n(PILL_RADIUS)}`,

    `V ${n(transitionY)}`,
    `C ${n(pillRight)} ${n(bodyTop - 2)}, ${n(pillRight + shoulderWidth * 0.45)} ${n(bodyTop)}, ${n(pillRight + shoulderWidth)} ${n(bodyTop)}`,

    `H ${n(bodyRight - bodyRadius)}`,
    `Q ${n(bodyRight)} ${n(bodyTop)} ${n(bodyRight)} ${n(bodyTop + bodyRadius)}`,

    `V ${n(bottom - bodyRadius)}`,
    `Q ${n(bodyRight)} ${n(bottom)} ${n(bodyRight - bodyRadius)} ${n(bottom)}`,

    `H ${n(bodyRadius)}`,
    `Q 0 ${n(bottom)} 0 ${n(bottom - bodyRadius)}`,

    `V ${n(PILL_RADIUS)}`,
    `Q 0 0 ${n(PILL_RADIUS)} 0`,

    'Z',
  ].join(' ')
}

function createRightExpandedPath(toastWidth: number, pillWidth: number, expandedHeight: number, progress: number): string {
  const pillX = toastWidth - pillWidth

  const bodyLeft = lerp(pillX, 0, progress)
  const bodyTop = lerp(PILL_H - 1, BODY_Y, progress)
  const bottom = lerp(PILL_H, expandedHeight, progress)

  const shoulderWidth = lerp(0, 17, progress)
  const shoulderRise = lerp(0, 10, progress)

  const availableBodyHeight = Math.max(0, bottom - bodyTop)
  const availableBodyWidth = Math.max(0, toastWidth - bodyLeft)

  const bodyRadius = Math.min(lerp(0, BODY_RADIUS, progress), availableBodyHeight / 2, availableBodyWidth / 2)

  const transitionY = bodyTop - shoulderRise

  return [
    `M ${n(pillX + PILL_RADIUS)} 0`,

    `H ${n(toastWidth - PILL_RADIUS)}`,
    `Q ${n(toastWidth)} 0 ${n(toastWidth)} ${n(PILL_RADIUS)}`,

    `V ${n(bottom - bodyRadius)}`,
    `Q ${n(toastWidth)} ${n(bottom)} ${n(toastWidth - bodyRadius)} ${n(bottom)}`,

    `H ${n(bodyLeft + bodyRadius)}`,
    `Q ${n(bodyLeft)} ${n(bottom)} ${n(bodyLeft)} ${n(bottom - bodyRadius)}`,

    `V ${n(bodyTop + bodyRadius)}`,
    `Q ${n(bodyLeft)} ${n(bodyTop)} ${n(bodyLeft + bodyRadius)} ${n(bodyTop)}`,

    `H ${n(pillX - shoulderWidth)}`,
    `C ${n(pillX - shoulderWidth * 0.45)} ${n(bodyTop)}, ${n(pillX)} ${n(bodyTop - 2)}, ${n(pillX)} ${n(transitionY)}`,

    `V ${n(PILL_RADIUS)}`,
    `Q ${n(pillX)} 0 ${n(pillX + PILL_RADIUS)} 0`,

    'Z',
  ].join(' ')
}

function createAnimatedPath(
  toastWidth: number,
  pillX: number,
  pillWidth: number,
  expandedHeight: number,
  progress: number,
  align: ToastAlign,
): string {
  if (progress <= 0.001) {
    return createPillPath(pillX, pillWidth)
  }

  if (align === 'left') {
    return createLeftExpandedPath(toastWidth, pillWidth, expandedHeight, progress)
  }

  if (align === 'right') {
    return createRightExpandedPath(toastWidth, pillWidth, expandedHeight, progress)
  }

  return createCenteredExpandedPath(toastWidth, pillX, pillWidth, expandedHeight, progress)
}

// ─── DOM ──────────────────────────────────────────────────────────────────────

function mountStyles(): void {
  if (document.getElementById('_toast-css')) {
    return
  }

  const style = document.createElement('style')
  style.id = '_toast-css'
  style.textContent = CSS
  document.head.appendChild(style)
}

function mountResizeHandler(): void {
  if (resizeMounted) {
    return
  }

  window.addEventListener('resize', () => {
    if (resizeFrame !== undefined) {
      window.cancelAnimationFrame(resizeFrame)
    }

    resizeFrame = window.requestAnimationFrame(() => {
      roots.forEach((root, position) => {
        applyRootResponsiveStyles(root, position)
      })

      activeLayouts.forEach(layout => {
        layout()
      })
    })
  })

  resizeMounted = true
}

function getRoot(position: ToastPosition): HTMLElement {
  const existingRoot = roots.get(position)

  if (existingRoot && document.contains(existingRoot)) {
    applyRootResponsiveStyles(existingRoot, position)
    return existingRoot
  }

  mountStyles()
  mountResizeHandler()

  const root = document.createElement('div')
  root.className = '_toast-root'
  root.dataset.position = position
  root.setAttribute('aria-live', 'polite')
  root.setAttribute('aria-atomic', 'true')

  applyRootResponsiveStyles(root, position)

  document.body.appendChild(root)
  roots.set(position, root)

  return root
}

function removeToast(el: HTMLElement): void {
  activeLayouts.delete(el)
  el.remove()
}

function dismiss(el: HTMLElement): void {
  if (el.classList.contains('is-out')) {
    return
  }

  el.classList.add('is-out')

  el.addEventListener(
    'animationend',
    () => {
      removeToast(el)
    },
    { once: true },
  )

  window.setTimeout(() => {
    removeToast(el)
  }, 320)
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function show(type: ToastType, title: string, options: ToastOptions = {}): () => void {
  const { description, duration = 4000, position = settings.position } = options

  const side = getSide(position)
  const align = getAlign(position)

  const root = getRoot(position)
  const palette = PALETTE[type]

  const visibleToasts = root.querySelectorAll<HTMLElement>('._toast:not(.is-out)')

  if (visibleToasts.length >= 4) {
    dismiss(visibleToasts[visibleToasts.length - 1])
  }

  const toastElement = document.createElement('div')
  toastElement.className = '_toast'
  toastElement.dataset.side = side
  toastElement.dataset.align = align
  toastElement.setAttribute('role', 'alert')

  toastElement.innerHTML = `
    <svg class="_toast-svg" data-canvas>
      <g data-shape-group>
        <path data-background></path>
      </g>
    </svg>

    <div class="_toast-header" data-header>
      <div class="_toast-header-inner">
        <div
          class="_toast-badge"
          style="
            color: ${palette.icon};
            background: ${palette.iconBg};
            border-color: ${palette.iconBorder};
          "
        >
          ${ICON[type]}
        </div>

        <span
          class="_toast-title"
          data-title
          style="color: ${palette.title};"
        ></span>
      </div>
    </div>

    ${
      description
        ? `
          <div class="_toast-content" data-content>
            <p class="_toast-desc" data-description></p>
          </div>
        `
        : ''
    }
  `

  const titleElement = toastElement.querySelector<HTMLElement>('[data-title]')!

  titleElement.textContent = title

  const descriptionElement = toastElement.querySelector<HTMLElement>('[data-description]')

  if (descriptionElement && description) {
    descriptionElement.textContent = description
  }

  root.prepend(toastElement)

  const header = toastElement.querySelector<HTMLElement>('[data-header]')!

  const content = toastElement.querySelector<HTMLElement>('[data-content]')

  const svg = toastElement.querySelector<SVGSVGElement>('[data-canvas]')!

  const shapeGroup = toastElement.querySelector<SVGGElement>('[data-shape-group]')!

  const background = toastElement.querySelector<SVGPathElement>('[data-background]')!

  let expandTimeoutId: number | undefined
  let expandAnimationId: number | undefined
  let dismissTimeoutId: number | undefined

  let expansionProgress = 0
  let contentVisible = false

  const layout = (): void => {
    applyRootResponsiveStyles(root, position)

    const toastWidth = getResponsiveToastWidth()
    const maxTitleWidth = getMaxTitleWidth(toastWidth)
    const maxPillWidth = getMaxPillWidth(toastWidth)
    const minPillWidth = getMinPillWidth(toastWidth)

    titleElement.style.maxWidth = `${maxTitleWidth}px`

    const visibleTitleWidth = Math.min(titleElement.scrollWidth, maxTitleWidth)

    const desiredPillWidth = PILL_PAD_X * 2 + ICON_W + HEADER_GAP + visibleTitleWidth

    const pillWidth = clamp(desiredPillWidth, minPillWidth, maxPillWidth)

    const pillX = getPillX(align, toastWidth, pillWidth)

    header.style.width = `${pillWidth}px`

    titleElement.style.maxWidth = `${pillWidth - PILL_PAD_X * 2 - ICON_W - HEADER_GAP}px`

    const expandedHeight = description && content ? Math.max(84, BODY_Y + content.offsetHeight) : PILL_H

    const currentHeight = description ? lerp(PILL_H, expandedHeight, expansionProgress) : PILL_H

    background.setAttribute('d', createAnimatedPath(toastWidth, pillX, pillWidth, expandedHeight, expansionProgress, align))

    if (side === 'bottom') {
      shapeGroup.setAttribute('transform', `translate(0 ${n(currentHeight)}) scale(1 -1)`)
    } else {
      shapeGroup.removeAttribute('transform')
    }

    svg.setAttribute('width', String(toastWidth))
    svg.setAttribute('height', String(currentHeight))
    svg.setAttribute('viewBox', `0 0 ${toastWidth} ${currentHeight}`)

    toastElement.style.width = `${toastWidth}px`
    toastElement.style.height = `${currentHeight}px`

    const isTruncated = titleElement.scrollWidth > titleElement.clientWidth + 1

    if (isTruncated) {
      titleElement.title = title
      titleElement.dataset.truncated = 'true'
    } else {
      titleElement.removeAttribute('title')
      titleElement.removeAttribute('data-truncated')
    }

    if (contentVisible) {
      toastElement.classList.add('is-content-visible')
    }
  }

  activeLayouts.set(toastElement, layout)

  requestAnimationFrame(() => {
    layout()

    if (!description || !content) {
      return
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      expansionProgress = 1
      contentVisible = true
      layout()
      return
    }

    expandTimeoutId = window.setTimeout(() => {
      const animationStart = performance.now()

      const animateExpansion = (time: number): void => {
        if (toastElement.classList.contains('is-out')) {
          return
        }

        const rawProgress = clamp((time - animationStart) / EXPAND_DURATION, 0, 1)

        expansionProgress = easeOutCubic(rawProgress)

        if (!contentVisible && rawProgress >= CONTENT_APPEAR_PROGRESS) {
          contentVisible = true
        }

        layout()

        if (rawProgress < 1) {
          expandAnimationId = window.requestAnimationFrame(animateExpansion)
          return
        }

        expansionProgress = 1
        contentVisible = true
        layout()
      }

      expandAnimationId = window.requestAnimationFrame(animateExpansion)
    }, EXPAND_DELAY)
  })

  let remainingTime = duration
  let startedAt = Date.now()

  const startDismissTimer = (): void => {
    startedAt = Date.now()

    dismissTimeoutId = window.setTimeout(() => {
      dismiss(toastElement)
    }, remainingTime)
  }

  toastElement.addEventListener('mouseenter', () => {
    if (dismissTimeoutId !== undefined) {
      window.clearTimeout(dismissTimeoutId)
    }

    const elapsedTime = Date.now() - startedAt
    remainingTime = Math.max(0, remainingTime - elapsedTime)
  })

  toastElement.addEventListener('mouseleave', () => {
    if (remainingTime <= 0) {
      dismiss(toastElement)
      return
    }

    startDismissTimer()
  })

  toastElement.addEventListener('click', () => {
    if (dismissTimeoutId !== undefined) {
      window.clearTimeout(dismissTimeoutId)
    }

    if (expandTimeoutId !== undefined) {
      window.clearTimeout(expandTimeoutId)
    }

    if (expandAnimationId !== undefined) {
      window.cancelAnimationFrame(expandAnimationId)
    }

    dismiss(toastElement)
  })

  startDismissTimer()

  return () => {
    if (dismissTimeoutId !== undefined) {
      window.clearTimeout(dismissTimeoutId)
    }

    if (expandTimeoutId !== undefined) {
      window.clearTimeout(expandTimeoutId)
    }

    if (expandAnimationId !== undefined) {
      window.cancelAnimationFrame(expandAnimationId)
    }

    dismiss(toastElement)
  }
}

// ─── API pública ──────────────────────────────────────────────────────────────

export const toast = {
  configure: (configuration: ToastConfiguration): void => {
    if (configuration.position) {
      settings.position = configuration.position
    }

    if (configuration.bottomOffset !== undefined) {
      settings.bottomOffset = configuration.bottomOffset
    }

    if (configuration.mobileBottomOffset !== undefined) {
      settings.mobileBottomOffset = configuration.mobileBottomOffset
    }

    if (configuration.mobileBreakpoint !== undefined) {
      settings.mobileBreakpoint = configuration.mobileBreakpoint
    }

    if (configuration.mobileSideGap !== undefined) {
      settings.mobileSideGap = configuration.mobileSideGap
    }

    roots.forEach((root, position) => {
      applyRootResponsiveStyles(root, position)
    })

    activeLayouts.forEach(layout => {
      layout()
    })
  },

  setPosition: (position: ToastPosition): void => {
    settings.position = position
  },

  success: (title: string, options?: ToastOptions) => show('success', title, options),

  error: (title: string, options?: ToastOptions) => show('error', title, options),

  warning: (title: string, options?: ToastOptions) => show('warning', title, options),

  info: (title: string, options?: ToastOptions) => show('info', title, options),
}
