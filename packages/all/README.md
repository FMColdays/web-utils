# @fmcoldays/all

Meta-paquete que instala y registra todos los paquetes `@fmcoldays` de una sola importación.

```bash
npm install @fmcoldays/all
```

Incluye: `@fmcoldays/notify`, `@fmcoldays/modal`, `@fmcoldays/dropzone`, `@fmcoldays/post-action`, `@fmcoldays/ajax-ext`, `@fmcoldays/shared`.

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
| [`@fmcoldays/ajax-ext`](../ajax-ext) | Extiende jQuery Unobtrusive Ajax con `data-ajax-*` adicionales |
| [`@fmcoldays/shared`](../shared) | Utilidades HTTP y DOM compartidas (no requiere import directo) |

---

## Setup en ASP.NET MVC

`@fmcoldays/ajax-ext` requiere conectar dos globals a los eventos jQuery de Unobtrusive Ajax. En tu `site.js` o `_Layout.cshtml`:

```js
$(document).ajaxSend(function (e, xhr) {
  window.handleAjaxSend(xhr)
})
$(document).ajaxComplete(function (e, xhr) {
  window.handleAjaxComplete(xhr)
})
```

El resto se auto-inicializa. Consulta el README de cada paquete individual para la documentación completa de atributos y opciones.
