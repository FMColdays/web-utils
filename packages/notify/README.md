# @fmcoldays/notify

Notificaciones de pantalla completa y diálogo de confirmación.
**Sin dependencias externas** — inyecta sus propios estilos, no requiere CSS aparte.

```bash
npm install @fmcoldays/notify
```

---

## Popup (notificación de pantalla completa)

Muestra un modal con backdrop de color. Un solo botón — bloquea hasta que el usuario lo cierra.

```ts
import { popup } from '@fmcoldays/notify'

await popup({ type: 'success', title: 'Guardado', message: 'El registro se guardó correctamente.' })
await popup({ type: 'error',   title: 'Error',    message: 'No se pudo completar la operación.' })
await popup({ type: 'warning', title: 'Atención', message: 'Revisa los datos antes de continuar.' })
await popup({ type: 'info',    title: 'Info',     message: 'La sincronización tardará unos minutos.' })
```

| Opción | Tipo | Default | Descripción |
|---|---|---|---|
| `type` | `'success' \| 'error' \| 'warning' \| 'info'` | `'success'` | Color del backdrop y del badge. |
| `title` | `string` | `'Éxito'` | Título del popup. |
| `message` | `string` | `''` | Mensaje descriptivo. |
| `confirmText` | `string` | `'Aceptar'` | Texto del botón. |

---

## Confirmación

```ts
import { confirm } from '@fmcoldays/notify'

const ok = await confirm({
  title: '¿Eliminar item?',
  message: 'Esta acción no se puede deshacer.',
  confirmText: 'Sí, eliminar',
  cancelText: 'Cancelar',
  type: 'error',
})
if (ok) { /* ... */ }
```

Resuelve `true` si el usuario confirma, `false` si cancela o cierra con ESC.

| Opción | Tipo | Default |
|---|---|---|
| `title` | `string` | `'¿Estás seguro?'` |
| `message` | `string` | `'Esta acción no se puede deshacer.'` |
| `confirmText` | `string` | `'Sí, continuar'` |
| `cancelText` | `string` | `'Cancelar'` |
| `type` | `'warning' \| 'error' \| 'info' \| 'success'` | `'warning'` |

---

## Tema oscuro

Tanto `popup` como `confirm` respetan `[data-theme='dark']` en un ancestro.

---

## Estructura

```
src/
├── index.ts            # barril (popup, confirm, tipos)
├── notify.ts           # popup() — notificación de pantalla completa
├── confirm.ts          # diálogo de confirmación con dos botones
├── types/              # ToastType
└── const/              # PALETTE, ICON
```
