# @fmcoldays/toast

Notificaciones (toasts) animadas con morphing de SVG, y diálogo de confirmación.
**Sin dependencias externas** — inyecta sus propios estilos, no requiere CSS aparte.

```bash
npm install @fmcoldays/toast
```

## Toasts

```ts
import { toast } from '@fmcoldays/toast'

toast.success('Guardado')
toast.error('Error', { description: 'No se pudo completar la operación.' })
toast.warning('Cuidado', { description: 'Revisa los datos.', duration: 6000 })
toast.info('Info', { position: 'bottom-right' })
```

`toast.success/error/warning/info(title, options?)` → devuelve una función para cerrarlo.

| Opción | Tipo | Default | Descripción |
|---|---|---|---|
| `description` | string | — | Texto secundario; el toast se expande para mostrarlo. |
| `duration` | number | `4000` | ms antes de auto-cerrarse (se pausa al pasar el mouse). |
| `position` | `ToastPosition` | `top-center` | `top/bottom` × `left/center/right`. |

Configuración global:

```ts
toast.configure({ position: 'bottom-right', bottomOffset: 24 })
toast.setPosition('top-right')
```

## Confirmación

```ts
import { confirm } from '@fmcoldays/toast'

const ok = await confirm({
  title: '¿Eliminar item?',
  message: 'Esta acción no se puede deshacer.',
  confirmText: 'Sí, eliminar',
  cancelText: 'Cancelar',
  type: 'error', // warning (default) | error | info | success
})
if (ok) { /* ... */ }
```

Mismo lenguaje visual que los toasts (tarjeta blanca, badge de color, animación).

## Tema oscuro

Tanto toasts como confirm respetan `[data-theme='dark']` en un ancestro.

## Estructura

```
src/
├── index.ts            # barril (toast, confirm, tipos)
├── toast.ts            # sistema de toasts (SVG morphing)
├── confirm.ts          # diálogo de confirmación
├── types/              # ToastType, ToastPosition, ToastOptions, ToastConfiguration
└── const/              # PALETTE, ICON (compartidos por toast y confirm)
```
