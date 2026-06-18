# @fmcoldays/post-action

Ejecuta peticiones HTTP desde cualquier elemento HTML con `data-action="true"`. Soporta confirmación, loading state, actualización de targets en el DOM, notificaciones, descarga de archivos y redirección. Sin dependencias externas.

```bash
npm install @fmcoldays/post-action
```

> Las notificaciones y la confirmación las da [`@fmcoldays/notify`](../notify) (dependencia interna, se instala sola).

## Uso

Importar una vez al arrancar la app; el listener se registra solo:

```ts
import '@fmcoldays/post-action'
```

Control manual (opcional):

```ts
import { registerPostAction } from '@fmcoldays/post-action'

const unregister = registerPostAction()
// unregister() para quitar el listener
```

Funciona en cualquier elemento (`<button>`, `<a>`, `<form>`, `<div>`…) mediante event delegation.

---

## Atributos

### Requerido

| Atributo | Tipo | Descripción |
|---|---|---|
| `data-action` | `"true"` | Activa el listener en el elemento. |

### Petición

| Atributo | Tipo | Default | Descripción |
|---|---|---|---|
| `data-action-url` | `string` (URL) | — | URL de la petición. Si se omite: en `<form>` usa el atributo `action`; en `<a>` usa el `href`. |
| `data-action-method` | `string` | `"POST"` | Método HTTP. Si se omite: en `<form>` usa el atributo `method`; en `<a>` usa `GET`. |
| `data-action-body` | `string` (JSON) | — | Body como JSON literal. En GET se añade al query string. |
| `data-action-body-form` | `string` (selector) | — | Selector de un `<form>` cuyo contenido se envía como `FormData` (POST) o query string (GET). |
| `data-action-pick` | `string` (JSON) | — | Mapa `{ "campo": "#selector" }` resuelto al momento del click. GET → query string. POST → body JSON. |
| `data-action-csrf` | `"true"` | — | Incluye el token CSRF en el header `RequestVerificationToken`. |

> **Forms:** `<form data-action="true">` intercepta el submit y envía los campos como `FormData`. El token CSRF de ASP.NET (campo oculto `__RequestVerificationToken`) va incluido automáticamente.

### Confirmación

| Atributo | Tipo | Default | Descripción |
|---|---|---|---|
| `data-action-confirm` | `"true"` | — | Muestra diálogo de confirmación antes de ejecutar. |
| `data-action-confirm-title` | `string` | `"¿Estás seguro?"` | Título del diálogo. |
| `data-action-confirm-description` | `string` | `"Esta acción no se puede deshacer."` | Mensaje del diálogo. |

### Loading

| Atributo | Tipo | Default | Descripción |
|---|---|---|---|
| `data-action-disable` | `"true"` | — | Deshabilita el elemento (o el botón de submit) durante la petición. |
| `data-action-loading-class` | `string` | — | Clases CSS a añadir al trigger durante la petición (ej. `"loading loading-spinner"`). |

### Resultado

| Atributo | Tipo | Default | Descripción |
|---|---|---|---|
| `data-action-target` | `string` (selector) | — | Selector del elemento donde se inyecta la respuesta HTML. |
| `data-action-target-prop` | `"html" \| "text" \| "value"` | `"html"` | Propiedad del target a actualizar. |
| `data-action-download` | `"true"` | — | Trata la respuesta como archivo descargable. El nombre se toma del header `Content-Disposition`. Silencioso por defecto. |
| `data-action-silent` | `"true"` | — | Suprime la notificación de **éxito**. Los errores se muestran siempre. |
| `data-action-success-msg` | `string` | `"La operación se completó exitosamente."` | Mensaje de éxito. |
| `data-action-error-msg` | `string` | `"Ocurrió un error al realizar la operación."` | Mensaje de error. |

### Post-éxito

| Atributo | Tipo | Descripción |
|---|---|---|
| `data-action-reload` | `"true"` | Recarga la página tras éxito. |
| `data-action-redirect` | `string` (URL) | Redirige a esta URL tras éxito. |
| `data-action-then` | `string` (selector) | Hace click en este elemento tras éxito. |

---

## Ejemplos

### DELETE con confirmación y recarga

```html
<button type="button"
        data-action="true"
        data-action-url="/api/items/42"
        data-action-method="DELETE"
        data-action-confirm="true"
        data-action-confirm-title="¿Eliminar item?"
        data-action-confirm-description="Esta acción no se puede deshacer."
        data-action-reload="true">
  Eliminar
</button>
```

### Form — guardar y refrescar tabla

```html
<!-- action y method del form se usan como fallback, no hace falta data-action-url -->
<form action="/Clientes/Crear"
      method="post"
      data-action="true"
      data-action-disable="true"
      data-action-then="#filtro-form">

  <input name="Nombre" />
  <input name="Email" />
  <button type="submit">Guardar</button>
</form>
```

### Form — confirmar antes de enviar

```html
<form action="/Pedidos/Confirmar"
      method="post"
      data-action="true"
      data-action-confirm="true"
      data-action-confirm-title="Confirmar pedido"
      data-action-confirm-description="¿Enviar este pedido? No se puede modificar después."
      data-action-redirect="/Pedidos">

  <!-- campos -->
  <button type="submit">Confirmar</button>
</form>
```

### Enlace que inyecta HTML (GET desde href)

```html
<!-- href se usa como URL y GET como method por defecto -->
<a href="/Clientes/42/Detalle"
   data-action="true"
   data-action-target="#panel-detalle"
   data-action-silent="true">
  Ver detalle
</a>
```

### GET que inyecta HTML en un target

```html
<button type="button"
        data-action="true"
        data-action-url="/api/preview/42"
        data-action-method="GET"
        data-action-target="#preview-container"
        data-action-silent="true">
  Ver preview
</button>
```

### GET con parámetros dinámicos de inputs

```html
<button type="button"
        data-action="true"
        data-action-url="/Reportes/Filtrar"
        data-action-method="GET"
        data-action-pick='{"fecha": "#fecha", "id": "#id_caja"}'
        data-action-target="#resultado"
        data-action-silent="true">
  Filtrar
</button>
```

### Descargar archivo Excel

```html
<button type="button"
        data-action="true"
        data-action-url="/SensorData/GenerarReporte"
        data-action-method="GET"
        data-action-pick='{"id": "#id_caja", "fecha": "#fecha"}'
        data-action-download="true">
  Descargar Excel
</button>
```

### Toggle silencioso que actualiza el DOM

```html
<button type="button"
        data-action="true"
        data-action-url="/api/toggle/42"
        data-action-target="#status-badge"
        data-action-silent="true"
        data-action-loading-class="loading loading-spinner">
  Activar
</button>
```

---

## Respuesta JSON esperada del backend

```json
{ "success": true,  "message": "Guardado correctamente." }
{ "success": false, "message": "El correo ya existe." }
```

- `success: false` activa el flujo de error aunque HTTP sea 200.
- Si no viene `message`, usa el valor del atributo HTML.

En ASP.NET MVC:

```csharp
return Json(new { success = true,  message = "Guardado correctamente." });
return Json(new { success = false, message = "El correo ya existe." });
```

---

## Notas

- Para `<input type="checkbox">` o `<input type="radio">`: el estado se togglea tras el éxito.
- `data-action-reload` y `data-action-redirect` son mutuamente excluyentes; `redirect` tiene prioridad.
- `data-action-download` y `data-action-target` son mutuamente excluyentes; con download no se inyecta HTML.

---

## API programática

| Export | Descripción |
|---|---|
| `registerPostAction(root?)` | Registra los listeners de click y submit. Devuelve una función para desregistrar. |
| `handlePostActionClick(e)` | Handler de click crudo. |
| `handlePostActionSubmit(e)` | Handler de submit crudo. |
| `executeRequest(opts)` | Ejecuta la petición HTTP a partir de un `ActionOptions`. |
| `parseOptions(el)` | Lee los `data-action-*` de un elemento a `ActionOptions`. |
| Tipos | `ActionOptions`, `ActionResult`. |

## Estructura

```
src/
├── index.ts                     # barril + auto-registro
├── register.ts                  # listeners (click + submit, event delegation)
├── handle-post-action-click.ts  # orquestador para elementos clickeables
├── handle-post-action-submit.ts # orquestador para forms
├── types/                       # ActionOptions, ActionResult
├── helpers/                     # options, dom, notify, download, server-message
└── services/                    # request.service (fetch + shared.buildHttpPayload)
```
