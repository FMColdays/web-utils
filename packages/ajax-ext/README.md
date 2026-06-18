# @fmcoldays/ajax-ext

Extiende **jQuery Unobtrusive Ajax** (`data-ajax="true"`) con comportamientos declarativos via atributos `data-ajax-*` adicionales.

- Confirmación async con `@fmcoldays/notify` (reemplaza `window.confirm`)
- Loading state en el botón de submit
- Notificaciones de éxito/error con `notify` de `@fmcoldays/notify`
- Dismiss automático del `<dialog>` al completar con éxito
- Redirect, reload, toggle, scroll, reset de form
- Encadenar acciones con `data-ajax-then`
- Abrir o refrescar modales con `data-ajax-open` / `data-ajax-refresh-modal`

Sin jQuery directo — usa `window.$` en runtime (ASP.NET MVC lo provee globalmente).

---

## Instalación

```bash
npm install @fmcoldays/ajax-ext
```

O con el meta-paquete que incluye todo:

```bash
npm install @fmcoldays/all
```

---

## Setup en site.js / site.ts

```ts
import '@fmcoldays/ajax-ext'
```

La importación registra los event listeners y expone en `window`:

| Global | Llamado desde |
|---|---|
| `window.handleAjaxSend(xhr)` | Evento jQuery `ajaxSend` |
| `window.handleAjaxComplete(xhr)` | Evento jQuery `ajaxComplete` |
| `window.isAjaxExtPending()` | Verificación antes de navegar |

En tu `_Layout.cshtml` o `site.js` conecta los globals con los eventos jQuery:

```js
$(document).ajaxSend(function (e, xhr) {
  window.handleAjaxSend(xhr)
})
$(document).ajaxComplete(function (e, xhr) {
  window.handleAjaxComplete(xhr)
})
```

---

## Atributos disponibles

Todos van en el mismo elemento `<form data-ajax="true">` o `<a data-ajax="true">`.

### Confirmación

| Atributo | Tipo | Descripción |
|---|---|---|
| `data-ajax-confirm` | `"true"` | Activa el diálogo de confirmación antes de enviar. |
| `data-ajax-confirm-title` | `string` | Título del diálogo. |
| `data-ajax-confirm-description` | `string` | Mensaje descriptivo del diálogo. |

```html
<form data-ajax="true"
      data-ajax-confirm="true"
      data-ajax-confirm-title="Confirmar eliminación"
      data-ajax-confirm-description="¿Eliminar este registro? No se puede deshacer.">
```

### Loading state

| Atributo | Tipo | Descripción |
|---|---|---|
| `data-ajax-disable` | `"true"` | Deshabilita el botón de submit durante la petición. |
| `data-ajax-loading-text` | `string` | Texto que muestra el botón durante la petición. |

```html
<form data-ajax="true"
      data-ajax-disable="true"
      data-ajax-loading-text="Guardando...">
```

### Notificaciones

| Atributo | Tipo | Descripción |
|---|---|---|
| `data-ajax-notify` | `string` | Mensaje `notify` de éxito al completar. Si el backend devuelve `{ message }`, ese tiene prioridad. |
| `data-ajax-notify-error` | `string` | Mensaje `notify` de error. También usa `message` del backend si viene. |
| `data-ajax-mute` | `"true"` | Suprime todas las notificaciones. |

```html
<form data-ajax="true"
      data-ajax-notify="Registro guardado correctamente."
      data-ajax-notify-error="No se pudo guardar. Intenta de nuevo.">
```

El backend puede sobrescribir el mensaje devolviendo JSON:

```json
{ "success": true, "message": "Guardado el 15/06/2026." }
{ "success": false, "message": "El correo ya está registrado." }
```

### Navegación post-éxito

| Atributo | Tipo | Descripción |
|---|---|---|
| `data-ajax-redirect` | `string` (URL) | Redirige a la URL indicada. |
| `data-ajax-reload` | `"true"` | Recarga la página actual. |
| `data-ajax-then` | `string` (selector) | Dispara click o submit en el elemento indicado. Útil para refrescar una tabla/lista tras guardar. |
| `data-ajax-open` | `string` (URL) | Abre un nuevo modal con la URL indicada (requiere `window.openModal`). |
| `data-ajax-refresh-modal` | `string` (URL) | Cierra el modal actual y lo reabre con nueva URL. |

```html
<!-- Refresca la tabla después de guardar -->
<form data-ajax="true"
      data-ajax-then="#filter-form"
      data-ajax-mute="true">
```

### Comportamiento del form

| Atributo | Tipo | Descripción |
|---|---|---|
| `data-ajax-reset` | `"true"` | Limpia todos los campos del form al completar con éxito. |
| `data-ajax-scroll-to` | `string` (selector) | Hace scroll suave al elemento indicado al completar. |
| `data-ajax-toggle` | `string` (selector) | Alterna la clase `hidden` del elemento indicado. |

### Control del modal

| Atributo | Valor | Descripción |
|---|---|---|
| `data-ajax-dismiss` | _(omitido)_ | **Auto (default):** cierra el `<dialog>` padre si existe. |
| `data-ajax-dismiss` | `"true"` | Cierra explícitamente el dialog padre. |
| `data-ajax-dismiss` | `"#mi-dialog"` | Cierra el dialog con ese selector. |
| `data-ajax-dismiss` | `"false"` | Nunca cierra el dialog aunque el form esté dentro de uno. |

---

## Respuesta JSON esperada del backend

El paquete parsea automáticamente la respuesta si es JSON:

```json
{ "success": true,  "message": "Texto opcional que sobreescribe data-ajax-notify" }
{ "success": false, "message": "Texto opcional que sobreescribe data-ajax-notify-error" }
```

- `success: false` activa el flujo de error aunque HTTP sea 200.
- `success: true` activa el flujo de éxito aunque HTTP sea 4xx/5xx.
- Si no viene `message`, usa el valor del atributo HTML.

En ASP.NET MVC:

```csharp
return Json(new { success = true,  message = "Guardado correctamente." });
return Json(new { success = false, message = "El correo ya existe." });
```

---

## Ejemplos completos

### Form dentro de modal — guardar y refrescar tabla

```html
<form id="form" data-ajax="true"
      data-ajax-method="post"
      data-ajax-url="/Usuarios/CreateOrEdit"
      data-ajax-disable="true"
      data-ajax-loading-text="Guardando..."
      data-ajax-then="#filter-form">
  <!-- campos -->
  <button type="submit">Guardar</button>
</form>
```

### Confirmar antes de eliminar

```html
<a data-ajax="true"
   data-ajax-method="post"
   data-ajax-url="/Clientes/Eliminar/5"
   data-ajax-confirm="true"
   data-ajax-confirm-title="Eliminar cliente"
   data-ajax-confirm-description="¿Eliminar este cliente? No se puede deshacer."
   data-ajax-reload="true">
  Eliminar
</a>
```

### Guardar sin notificación y solo recargar

```html
<form data-ajax="true"
      data-ajax-method="post"
      data-ajax-mute="true"
      data-ajax-reload="true">
```

---

## API exportada

```ts
import { handleAjaxSend, handleAjaxComplete, isAjaxExtPending } from '@fmcoldays/ajax-ext'
import type { AjaxExtOptions } from '@fmcoldays/ajax-ext'
```

Normalmente no necesitas importar estas funciones — el import de side-effect las conecta solas en `window`.
