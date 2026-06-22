# @fmcoldays/modal

Carga vistas parciales Razor en un `<dialog id="dialog-form">` vía `fetch`.
Se auto-inicializa: cualquier elemento con `data-modal-url` abre el modal al
hacer clic. Auto-detecta header, footer, formularios multi-paso y validación
unobtrusive de MVC. **Sin dependencias externas.**

```bash
npm install @fmcoldays/modal
```

## Uso

Importa el paquete y su CSS una vez al arrancar la app. El paquete **inyecta el
`<dialog>` solo** (si no existe), habilita `data-modal-url`, expone
`window.openModal`, activa drag y botón cerrar:

```ts
import '@fmcoldays/modal'
import '@fmcoldays/modal/styles'
```

No necesitas escribir el markup del modal: el shell (contenedor, grip de
arrastre, botón cerrar, slots header/steps/body/footer) se crea automáticamente.

### Cerrar el modal

- El botón `×` del shell ya cierra el modal.
- Para botones dentro de tu parcial (ej. "Cancelar"), agrega `data-modal-close`:

```html
<button type="button" data-modal-close>Cancelar</button>
```

- Desde JS: `document.getElementById('dialog-form').close()`.

### Tamaño del modal

Pon un atributo en el elemento raíz de tu vista parcial:

```html
<div chico>...</div>        <!-- 400px -->
<div mediano>...</div>      <!-- 800px (default) -->
<div grande>...</div>       <!-- 1000px -->
<div extra-grande>...</div> <!-- 1200px -->
```

### Control manual (opcional)

```ts
import { registerModal } from '@fmcoldays/modal'

const unregister = registerModal()
// unregister() para quitar el listener
```

### Loading

Mientras carga la vista parcial se muestra un **loading de pantalla completa**
(overlay integrado) y el modal se abre cuando llega el contenido. Puedes:

```ts
import { configureModal } from '@fmcoldays/modal'

// Usar tu propio elemento de loading (se muestra/oculta por display):
configureModal({ loadingSelector: '#mi-loading' })

// Personalizar el HTML del spinner integrado:
configureModal({ loadingTemplate: () => '<p>Cargando…</p>' })

// Delegar a un sistema de loading externo:
configureModal({
  onLoadingStart: () => myLoader.show(),
  onLoadingEnd: () => myLoader.hide(),
})

// Apuntar a otro id de contenedor:
configureModal({ body: '#dialog-form #modal-content' })
```

### Scripts en la vista parcial

Los `<script>` que incluyas en tu parcial se ejecutan automáticamente tras
inyectar el HTML (comportamiento equivalente al de jQuery `.html()`):

```html
<!-- dentro del parcial -->
<script>
  console.log('ejecutado al abrir el modal')
</script>
```

### Usar tu propio `<dialog>` (opcional)

Si ya tienes un `<dialog id="dialog-form">` en el layout, el paquete lo respeta
(no inyecta el suyo). Solo asegúrate de incluir `#modal-body` y los slots
`[data-modal-slot="header|steps|footer"]`.

---

## Atributos del trigger

### Requerido

| Atributo | Tipo | Descripción |
|---|---|---|
| `data-modal-url` | `string` (URL) | URL del endpoint que devuelve la vista parcial. |

### Petición

| Atributo | Tipo | Default | Descripción |
|---|---|---|---|
| `data-modal-method` | `string` | `"GET"` sin body, `"POST"` con body | Método HTTP. |
| `data-modal-body` | `string` (JSON) | — | Body JSON estático. En GET se añade al query string. |
| `data-modal-body-form` | `string` (selector) | — | Selector de `<form>` → `FormData` en POST, query string en GET. |
| `data-modal-pick` | `string` (JSON) | — | Mapa `{ "campo": "#selector" }` resuelto al click. GET → query string. POST → body JSON. |
| `data-modal-csrf` | `"true"` | — | Incluye token CSRF en el header `RequestVerificationToken`. |

---

## Ejemplos de trigger

```html
<!-- GET simple -->
<button data-modal-url="/Controller/Action">Abrir modal</button>

<!-- GET con parámetros dinámicos -->
<button data-modal-url="/SensorData/IndexAlertas"
        data-modal-pick='{"id": "#id_caja", "fecha": "#fecha"}'>
  Ver alertas
</button>

<!-- POST con body JSON estático -->
<button data-modal-url="/Reportes/Vista"
        data-modal-body='{"tipo": "mensual"}'
        data-modal-csrf="true">
  Ver reporte
</button>

<!-- POST con form completo -->
<button data-modal-url="/api/save"
        data-modal-body-form="#mi-form"
        data-modal-csrf="true">
  Guardar
</button>
```

---

## Llamada desde JS

```js
window.openModal('/Controller/Action')

window.openModal('/Controller/Action', {
  method: 'POST',
  bodyJson: '{"id": 42}',
  pick: { fecha: '#fecha' },
  csrf: true,
})
```

O importando directamente:

```ts
import { openModal } from '@fmcoldays/modal'
openModal('/Controller/Action', { method: 'POST', csrf: true })
```

---

## Estructura de la vista parcial

| Atributo | Propósito |
|---|---|
| `data-modal-header` | Encabezado visual. El modal lo extrae y muestra arriba. |
| `data-modal-footer` | Pie con botones de acción. Se mueve fuera del scroll. |
| `data-step-form` + `data-step="N"` | Formulario multi-paso. |

```html
<div class="p-1">
  <div data-modal-header>
    <h2>Título</h2>
  </div>

  <!-- contenido / formulario -->

  <div data-modal-footer>
    <button type="submit" form="miForm" class="btn btn-primary btn-sm">Guardar</button>
  </div>
</div>
```

---

## Validación unobtrusive (ASP.NET MVC)

La validación jQuery Unobtrusive se re-parsea automáticamente sobre los
formularios del parcial. No requiere configuración: el paquete accede a
`window.jQuery` si el proyecto lo carga (ASP.NET MVC lo incluye normalmente).
Si jQuery no está presente, la validación nativa del browser aplica.

---

## Formulario multi-paso

```html
<form id="miForm" data-step-form>
  <div data-step="1"><!-- paso 1 --></div>
  <div data-step="2" class="hidden"><!-- paso 2 --></div>
</form>
<div data-modal-footer>
  <button data-step-prev class="btn btn-sm">Anterior</button>
  <button data-step-next class="btn btn-primary btn-sm">Siguiente</button>
  <button data-step-submit type="submit" form="miForm" class="btn btn-primary btn-sm hidden">Guardar</button>
</div>
```

---

## Evento `modal:ready`

El paquete dispara `modal:ready` en `document` cada vez que el modal termina de renderizar. Úsalo para inicializar plugins que dependen del DOM (select2, flatpickr, etc.):

```ts
import type { ModalReadyEvent } from '@fmcoldays/modal'

document.addEventListener('modal:ready', (e) => {
  const { container } = (e as ModalReadyEvent).detail
  // container es el HTMLElement del cuerpo del modal
  $(container).find('select').select2({
    dropdownParent: $(container).closest('dialog'),
  })
})
```

El tipo `ModalReadyEvent` también está disponible desde `@fmcoldays/all`.

---

## API programática

| Export | Descripción |
|---|---|
| `registerModal(root?)` | Registra el listener + `window.openModal`. Devuelve fn para desregistrar. |
| `openModal(url, opts?)` | Abre el modal de forma programática. |
| `configureModal(partial)` | Configura selectores, loading y hooks. |
| `buildFetchOptions(url, opts)` | Traduce `ModalOptions` a `{ url, init: RequestInit }`. |
| Tipos | `ModalOptions`, `ModalReadyEvent`. |

## Estructura

```
src/
├── index.ts                  # barril + auto-registro
├── register.ts               # listener + window.openModal
├── open-modal.ts             # fetch + render pipeline
├── config.ts                 # configureModal / getModalConfig
├── const/                    # selectores del dialog
├── types/                    # ModalOptions + window.d.ts
├── templates/                # shell, error, loading
└── utils/
    ├── build-fetch-options   # ModalOptions → RequestInit
    ├── run-scripts           # ejecuta <script> del parcial inyectado
    ├── render-layout         # mueve header/footer/steps a sus slots
    ├── parse-unobtrusive     # re-parsea jQuery Validate si está presente
    ├── init-step-form        # wizard multi-paso
    ├── init-footer-submit    # enlaza botón submit del footer al form
    ├── init-drag             # drag por el grip
    └── ensure-shell          # auto-inyecta el <dialog> si no existe
```
