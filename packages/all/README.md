# @fmcoldays/all

Meta-paquete que instala y registra todos los paquetes `@fmcoldays` de una sola importación.

```bash
npm install @fmcoldays/all
```

Incluye: `@fmcoldays/notify`, `@fmcoldays/modal`, `@fmcoldays/dropzone`, `@fmcoldays/post-action`, `@fmcoldays/shared`.

---

## Uso

```ts
import '@fmcoldays/all'
import '@fmcoldays/all/styles'
```

El import de `@fmcoldays/all` auto-registra todos los listeners. El de `/styles` carga el CSS combinado de modal y dropzone.

Para usar la API de un paquete específico, impórtalo directamente:

```ts
import { openModal } from '@fmcoldays/modal'
import { notify, confirm } from '@fmcoldays/notify'
import { registerPostAction } from '@fmcoldays/post-action'
```

---

## Qué incluye

| Paquete | Qué hace |
|---|---|
| [`@fmcoldays/notify`](../notify) | Toasts animados y diálogo de confirmación async |
| [`@fmcoldays/modal`](../modal) | Carga vistas parciales Razor en `<dialog>` via fetch |
| [`@fmcoldays/dropzone`](../dropzone) | Zona drag & drop con preview, lightbox y geolocalización |
| [`@fmcoldays/post-action`](../post-action) | Peticiones HTTP declarativas via `data-action-url` |
| [`@fmcoldays/shared`](../shared) | Utilidades HTTP y DOM compartidas (no requiere import directo) |

---

## Configuración global

```ts
import { configure, fieldEquals, fieldNotEquals } from '@fmcoldays/all'

configure({
  postAction: {
    successRules: [fieldEquals('id', 200)],
    errorRules:   [fieldNotEquals('id', 200)],
  },
})
```

Llama a `configure` una vez al arrancar la app, después del import.

---

## Evento `modal:ready`

Escucha este evento para inicializar plugins en el contenido del modal (select2, flatpickr, etc.):

```ts
import type { ModalReadyEvent } from '@fmcoldays/all'

document.addEventListener('modal:ready', (e) => {
  const { container } = (e as ModalReadyEvent).detail
  $(container).find('select').select2({
    dropdownParent: $(container).closest('dialog'),
  })
})
```

---

## API exportada

| Export | Descripción |
|---|---|
| `configure(opts)` | Configura todos los paquetes desde un solo punto. |
| `fieldEquals(field, value)` | Regla: éxito/error si `data[field] === value`. |
| `fieldNotEquals(field, value)` | Regla: éxito/error si `data[field] !== value`. |
| `ModalReadyEvent` | Tipo del evento `modal:ready`. |

Consulta el README de cada paquete individual para la documentación completa de atributos y opciones.
