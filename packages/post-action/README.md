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
| `data-action-method` | `string` | `"POST"` | Método HTTP. Si se omite: en `<form>` usa el atributo `method` (default `GET` del browser); en `<a>` usa `GET`; en otros elementos usa `POST`. |
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

### Submit automático (`data-action-submit`)

Dispara `requestSubmit()` en un form cuando el elemento cambia o recibe input. Útil para filtros que se envían solos sin botón.

| Atributo | Tipo | Default | Descripción |
|---|---|---|---|
| `data-action-submit` | `string` (selector) o vacío | — | Selector del form a enviar. Si está vacío usa el form padre. |
| `data-action-submit-delay` | `number` (ms) | `400` para texto, `0` para el resto | Debounce antes de disparar el submit. Aplica a cualquier tipo de elemento. |

```html
<!-- Select dentro del form: dispara submit al cambiar -->
<select name="estado" data-action-submit>…</select>

<!-- Input de texto fuera del form: debounce 400ms por defecto -->
<input name="buscar" data-action-submit="#mi-form" />

<!-- Select fuera del form con delay personalizado -->
<select name="pagSize" data-action-submit="#mi-form" data-action-submit-delay="300">…</select>
```

> Para inputs con `min`/`max`, el valor se clampea automáticamente antes de enviar y mientras el usuario escribe.

### Clonar valor en un form (`data-action-bind`)

Crea un `<input type="hidden">` dentro del form con el valor del elemento original. Se mantiene sincronizado en tiempo real. Útil cuando el control está fuera del `<form>`.

| Atributo | Tipo | Default | Descripción |
|---|---|---|---|
| `data-action-bind` | `string` (selector) | — | Selector del form donde se inyecta el clon. |
| `data-action-bind-visible` | `"true"` | — | Hace visible el clon (útil para debug). |

```html
<!-- Select fuera del form: su valor viaja al form como hidden input -->
<select name="pageSize"
        data-action-bind="#filter-form"
        data-action-submit="#filter-form">…</select>

<!-- Input de texto fuera del form -->
<input name="pageNumber" type="text"
       min="1" max="@pgTotal"
       data-action-bind="#filter-form"
       data-action-submit="#filter-form" />
```

> Si el form es reemplazado por AJAX (`data-action-target`), el clon se recrea automáticamente.

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

El flujo de éxito o error se determina en este orden:

1. **HTTP status** — 4xx/5xx siempre es error.
2. **Campo `success` booleano** (cualquier capitalización) — `true` = éxito, `false` = error.
3. **`successRules` / `errorRules`** configuradas globalmente — primera que aplique gana.
4. Sin ninguno de los anteriores — se confía en el HTTP status.

El único campo de mensaje reconocido es `message` (en cualquier capitalización: `message`, `Message`, `MESSAGE`…).

```json
{ "message": "Guardado correctamente." }
{ "success": true,  "message": "Guardado correctamente." }
{ "success": false, "message": "El correo ya existe." }
```

En ASP.NET MVC:

```csharp
// Éxito HTTP
return Ok(new { message = "Guardado correctamente." });

// Error HTTP
return BadRequest(new { message = "El correo ya existe." });

// Éxito/error en el body (HTTP 200 siempre)
return Json(new { success = true,  message = "Guardado correctamente." });
return Json(new { success = false, message = "El correo ya existe." });
```

### Configuración global de reglas

Si tu backend usa una convención propia (ej. `id == 200` como éxito), configúralo una vez al arrancar la app:

```ts
import { PostAction, fieldEquals, fieldNotEquals } from '@fmcoldays/post-action'

PostAction.configure({
  successRules: [fieldEquals('id', 200)],
  errorRules:   [fieldNotEquals('id', 200)],
})
```

Con `@fmcoldays/all`:

```ts
import { configure, fieldEquals, fieldNotEquals } from '@fmcoldays/all'

configure({
  postAction: {
    successRules: [fieldEquals('id', 200)],
    errorRules:   [fieldNotEquals('id', 200)],
  },
})
```

| Helper | Descripción |
|---|---|
| `fieldEquals(field, value)` | Éxito/error si `data[field] === value`. |
| `fieldNotEquals(field, value)` | Éxito/error si `data[field] !== value`. |

También puedes pasar funciones custom:

```ts
PostAction.configure({
  successRules: [
    (data) => 'code' in data ? data.code === 1 : undefined
  ],
})
```

Cada función devuelve `true`, `false`, o `undefined` (no aplica, pasa a la siguiente regla).

---

## Notas

- Para `<input type="checkbox">` o `<input type="radio">`: el estado se togglea tras el éxito.
- `data-action-reload` y `data-action-redirect` son mutuamente excluyentes; `redirect` tiene prioridad.
- `data-action-download` y `data-action-target` son mutuamente excluyentes; con download no se inyecta HTML.

---

## API programática

| Export | Descripción |
|---|---|
| `registerPostAction(root?)` | Registra los listeners de click, submit, change e input. Devuelve una función para desregistrar. |
| `handlePostActionClick(e)` | Handler de click crudo. |
| `handlePostActionSubmit(e)` | Handler de submit crudo. |
| `handleActionSubmitTrigger(e)` | Handler de `data-action-submit` (change/input). |
| `bindElements(root?)` | Procesa `data-action-bind` en el root dado. Idempotente. |
| `executeRequest(opts)` | Ejecuta la petición HTTP a partir de un `ActionOptions`. |
| `parseOptions(el)` | Lee los `data-action-*` de un elemento a `ActionOptions`. |
| `PostAction.configure(opts)` | Configura reglas globales de éxito/error. |
| `fieldEquals(field, value)` | Helper — regla que evalúa `data[field] === value`. |
| `fieldNotEquals(field, value)` | Helper — regla que evalúa `data[field] !== value`. |
| Tipos | `ActionOptions`, `ActionResult`, `PostActionConfig`, `SuccessRule`, `ErrorRule`. |

## Estructura

```
src/
├── index.ts                        # barril + auto-registro
├── register.ts                     # listeners (click, submit, change, input, post-action:updated)
├── handle-post-action-click.ts     # orquestador para elementos clickeables
├── handle-post-action-submit.ts    # orquestador para forms
├── handle-action-submit-trigger.ts # data-action-submit (debounce, clamp min/max)
├── bind-elements.ts                # data-action-bind (clon hidden + re-bind tras AJAX)
├── types/                          # ActionOptions, ActionResult
├── helpers/                        # options, dom, notify, download, server-message
└── services/                       # request.service (fetch + shared.buildHttpPayload)
```
