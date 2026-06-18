# @fmcoldays/post-action

Ejecuta peticiones HTTP al hacer click en cualquier elemento con
`data-action-url`. Soporta confirmación, loading state, actualización de targets
en el DOM, notificaciones, descarga de archivos y redirección.

```bash
npm install @fmcoldays/post-action
```

> Las notificaciones y la confirmación las da [`@fmcoldays/notify`](../notify) (dependencia interna, se instala sola). Sin dependencias externas; inyecta sus propios estilos.

## Uso

Basta importar el paquete una vez al arrancar la app; el listener se registra solo:

```ts
import '@fmcoldays/post-action'
```

Control manual (opcional):

```ts
import { registerPostAction } from '@fmcoldays/post-action'

const unregister = registerPostAction()
// unregister() para quitar el listener
```

Funciona en cualquier elemento clickeable (`<button>`, `<a>`, `<div>`, `<input>`…) mediante event delegation. No necesita `onclick`.

---

## Atributos

### Requerido

| Atributo | Tipo | Descripción |
|---|---|---|
| `data-action-url` | `string` (URL) | URL a la que se hace la petición. |

### Petición

| Atributo | Tipo | Default | Descripción |
|---|---|---|---|
| `data-action-method` | `string` | `"POST"` | Método HTTP (`GET`, `POST`, `PUT`, `DELETE`, etc.). |
| `data-action-body` | `string` (JSON) | — | Body como JSON literal. En GET se añade al query string. |
| `data-action-body-form` | `string` (selector) | — | Selector de un `<form>` cuyo contenido se envía como `FormData` (POST) o query string (GET). |
| `data-action-pick` | `string` (JSON) | — | Mapa `{ "campo": "#selector" }` resuelto al momento del click. GET → query string. POST → body JSON. |
| `data-action-csrf` | `"true"` | — | Incluye el token CSRF en el header `RequestVerificationToken`. |

### Confirmación

| Atributo | Tipo | Default | Descripción |
|---|---|---|---|
| `data-action-confirm` | `"true"` | — | Muestra diálogo de confirmación antes de ejecutar. |
| `data-action-confirm-title` | `string` | `"¿Estás seguro?"` | Título del diálogo. |
| `data-action-confirm-msg` | `string` | `"Esta acción no se puede deshacer."` | Mensaje del diálogo. |

### Loading

| Atributo | Tipo | Default | Descripción |
|---|---|---|---|
| `data-action-disable` | `"true"` | — | Deshabilita el elemento mientras dura la petición. |
| `data-action-loading-class` | `string` | — | Clases CSS a añadir al trigger durante la petición (ej. `"loading loading-spinner"`). |

### Resultado

| Atributo | Tipo | Default | Descripción |
|---|---|---|---|
| `data-action-target` | `string` (selector) | — | Selector del elemento donde se inyecta la respuesta HTML. |
| `data-action-target-prop` | `"html" \| "text" \| "value"` | `"html"` | Propiedad del target a actualizar. |
| `data-action-download` | `"true"` | — | Trata la respuesta como archivo descargable (blob URL + descarga del navegador). El nombre se toma del header `Content-Disposition`. |
| `data-action-silent` | `"true"` | — | Suprime la notificación de **éxito**. Los errores se muestran siempre. |
| `data-action-success-msg` | `string` | `"La operación se completó exitosamente."` | Mensaje de éxito. |
| `data-action-error-msg` | `string` | `"Ocurrió un error al realizar la operación."` | Mensaje de error. |

### Post-éxito

| Atributo | Tipo | Descripción |
|---|---|---|
| `data-action-reload` | `"true"` | Recarga la página tras éxito. |
| `data-action-redirect` | `string` (URL) | Redirige a esta URL tras éxito. |
| `data-action-then` | `string` (selector) | Hace click en este elemento tras éxito (ej. cerrar modal o disparar otro action). |

---

## Ejemplos

### DELETE con confirmación y recarga
```html
<button type="button"
        data-action-url="/api/items/42"
        data-action-method="DELETE"
        data-action-confirm="true"
        data-action-confirm-title="¿Eliminar item?"
        data-action-confirm-msg="Esta acción no se puede deshacer."
        data-action-reload="true">
  Eliminar
</button>
```

### POST silencioso que actualiza un elemento del DOM
```html
<button type="button"
        data-action-url="/api/toggle/42"
        data-action-target="#status-badge"
        data-action-target-prop="html"
        data-action-silent="true"
        data-action-loading-class="loading loading-spinner">
  Activar
</button>
```

### GET que inyecta HTML en un target
```html
<button type="button"
        data-action-url="/api/preview/42"
        data-action-method="GET"
        data-action-target="#preview-container"
        data-action-silent="true">
  Ver preview
</button>
```

### Con body JSON
```html
<button type="button"
        data-action-url="/api/items"
        data-action-body='{"nombre":"Test","activo":true}'>
  Crear
</button>
```

### Submit de form como FormData
```html
<button type="button"
        data-action-url="/api/save"
        data-action-body-form="#mi-form"
        data-action-csrf="true"
        data-action-reload="true">
  Guardar
</button>
```

### Guardar y luego hacer click en otro trigger
```html
<button type="button"
        data-action-url="/api/alert/save/42"
        data-action-silent="true"
        data-action-then="#btn-cerrar-dropdown">
  Guardar alerta
</button>
```

### GET con parámetros dinámicos de inputs (pick)
```html
<button type="button"
        data-action-url="/Reportes/Filtrar"
        data-action-method="GET"
        data-action-pick='{"fecha": "#fecha", "id": "#id_caja"}'
        data-action-target="#resultado"
        data-action-silent="true">
  Filtrar
</button>
```

### POST con valores dinámicos mezclados con JSON estático
```html
<button type="button"
        data-action-url="/api/items"
        data-action-body='{"tipo": "sensor"}'
        data-action-pick='{"nombre": "#input-nombre", "fecha": "#fecha"}'>
  Crear
</button>
```

### Descargar archivo Excel
```html
<button type="button"
        data-action-url="/SensorData/GenerarReporte"
        data-action-method="GET"
        data-action-pick='{"id": "#id_caja", "fecha": "#fecha"}'
        data-action-download="true"
        data-action-silent="true">
  Descargar Excel
</button>
```

---

## Notas

- Para `<input type="checkbox">` o `<input type="radio">`: el estado se togglea tras el éxito.
- La respuesta puede ser HTML o JSON. Si el `Content-Type` es `application/json`, el valor se serializa a string antes de inyectarlo.
- Si la respuesta JSON trae un campo `message`, se usa como texto de la notificación (éxito o error).
- `data-action-reload` y `data-action-redirect` son mutuamente excluyentes; `redirect` tiene prioridad.
- `data-action-download` y `data-action-target` son mutuamente excluyentes; con download no se inyecta HTML.

---

## API programática

| Export | Descripción |
|---|---|
| `registerPostAction(root?)` | Registra el listener (event delegation). Devuelve una función para desregistrar. |
| `handlePostActionClick(e)` | Handler de click crudo, por si quieres engancharlo tú mismo. |
| `executeRequest(opts)` | Ejecuta solo la petición HTTP a partir de un `ActionOptions`. |
| `parseOptions(el)` | Lee los `data-action-*` de un elemento a `ActionOptions`. |
| Tipos | `ActionOptions`, `ActionResult`. |

## Estructura

```
src/
├── index.ts                    # barril + auto-registro
├── register.ts                 # listener (event delegation)
├── handle-post-action-click.ts # orquestador del ciclo completo
├── types/                      # ActionOptions, ActionResult
├── helpers/                    # options, dom, notify, download, server-message
└── services/                   # request.service (fetch + shared.buildHttpPayload)
```
