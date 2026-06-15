# @fmcoldays/dropzone

Zona de carga de archivos con drag & drop, previsualización y lightbox para
imágenes. Se auto-inicializa con `MutationObserver` — funciona en modales y
partiales AJAX.

```bash
npm install @fmcoldays/dropzone
```

> **Requisitos visuales:** los íconos son **SVG inline** (no requieren ninguna
> fuente de íconos — funciona igual con material-icons, material-symbols o sin
> ellas). El HTML sí usa clases de **Tailwind**: para que Tailwind genere las
> clases que viven dentro del paquete, agrega su ruta a tu `content`
> (Tailwind v3) o `@source` (v4):
> ```css
> /* Tailwind v4 (en tu CSS) */
> @source "../node_modules/@fmcoldays/dropzone/dist";
> ```
> Asume tokens del design system: `--color-primary`, utilidad `text-xxs`.

## Uso

Basta importar el paquete una vez al arrancar la app; se auto-inicializa:

```ts
import '@fmcoldays/dropzone'
```

```html
<div data-dropzone>
  <input type="file" data-dropzone-files name="archivo" class="sr-only" />
</div>
```

El `<input>` con `data-dropzone-files` es el campo real del formulario. El módulo
inserta la zona visual antes de él. Añade `class="sr-only"` para ocultar el input nativo.

---

## Atributos de configuración

Todos en el contenedor `[data-dropzone]`:

| Atributo | Tipo | Default | Descripción |
|---|---|---|---|
| `data-accepted-files` | string | `.jpg,.jpeg,.png,.pdf` | Extensiones separadas por coma |
| `data-max-filesize` | number | `10` | Tamaño máximo en MB |
| `data-max-files` | number | `1` | Cantidad máxima de archivos |
| `data-label` | string | `Arrastra aquí o selecciona` | Texto en la zona de drop |
| `data-url` | string | — | URL para subir el archivo inmediatamente (sin esperar submit) |
| `data-upload-param` | string | nombre del input | Nombre del parámetro en la subida inmediata |
| `data-target` | string | — | Selector CSS del elemento a actualizar con la respuesta |
| `data-geo-lat` | string (selector) | — | Input donde se escribe la **latitud** al agregar un archivo |
| `data-geo-lng` | string (selector) | — | Input donde se escribe la **longitud** al agregar un archivo |
| `data-geo-notify` | `"true"` | — | Muestra un mensaje visible al obtener (o fallar) la ubicación |

---

## Geolocalización

Si defines `data-geo-lat` y/o `data-geo-lng`, al agregar un archivo el módulo
pide la ubicación del dispositivo (`navigator.geolocation`) y escribe las
coordenadas en esos inputs (disparando `input`/`change` para validaciones).

```html
<div data-dropzone
     data-accepted-files=".jpg,.png"
     data-geo-lat="#latitud"
     data-geo-lng="#longitud">
  <input type="file" data-dropzone-files name="foto" class="sr-only" />
</div>
<input type="hidden" id="latitud"  name="Latitud" />
<input type="hidden" id="longitud" name="Longitud" />
```

Para un aviso visible al usuario agrega `data-geo-notify="true"`:

```html
<div data-dropzone data-geo-lat="#latitud" data-geo-lng="#longitud" data-geo-notify="true">
  <input type="file" data-dropzone-files name="foto" class="sr-only" />
</div>
```

- Requiere **HTTPS** (o `localhost`) y permiso del usuario.
- Eventos en el contenedor: `dz:geo` (`detail: { latitude, longitude, accuracy }`)
  y `dz:geo-error` (`detail: { reason, code }`).

---

## Preview de imágenes + lightbox

Cuando el archivo es una imagen, el item muestra una **miniatura**. Click en ella
abre un **lightbox** a tamaño completo.

| Interacción | Acción |
|---|---|
| Click en miniatura | Abre lightbox |
| Click fuera de la imagen | Cierra lightbox |
| Tecla `Escape` | Cierra lightbox |
| Botón "Cerrar" | Cierra lightbox |

El lightbox usa `<dialog>.showModal()` (top layer) y `URL.createObjectURL`; el
object URL se revoca al eliminar el archivo.

---

## Ejemplos

### Subida diferida (con formulario)

```html
<form asp-action="Guardar" method="post" enctype="multipart/form-data">
  <div data-dropzone
       data-accepted-files=".pdf,.xlsx"
       data-max-filesize="5"
       data-max-files="3"
       data-label="Arrastra tus documentos aquí">
    <input type="file" data-dropzone-files name="documentos" class="sr-only" />
  </div>
  <button type="submit" class="btn btn-primary">Guardar</button>
</form>
```

### Imágenes con preview

```html
<div data-dropzone
     data-accepted-files=".jpg,.jpeg,.png,.gif,.webp"
     data-max-filesize="5"
     data-max-files="5"
     data-label="Arrastra imágenes aquí o selecciona archivos">
  <input type="file" data-dropzone-files name="imagenes" multiple class="sr-only" />
</div>
```

### Subida inmediata (sin submit)

```html
<div data-dropzone
     data-accepted-files=".jpg,.png"
     data-url="/Api/UploadFoto"
     data-upload-param="foto"
     data-target="#preview-img">
  <input type="file" data-dropzone-files name="foto" class="sr-only" />
</div>
<img id="preview-img" src="" />
```

El servidor retorna la URL del archivo como texto plano o `{ url: "..." }`. Además
se emiten eventos `dz:success` / `dz:error` (bubbles) sobre el contenedor.

---

## API programática

```ts
import { initAllDropzones } from '@fmcoldays/dropzone'

initAllDropzones(document.querySelector('#mi-contenedor')) // un contenedor
initAllDropzones()                                          // todo el documento
```

También disponible como `window.initAllDropzones(...)`.

---

## Comportamiento al cancelar el picker

Si el usuario abre el selector y cierra sin elegir, los archivos previos **se
conservan** (se restaura `input.files` vía `DataTransfer`, incluso en Safari).

---

## Estructura

```
src/
├── index.ts                     # barril + auto-registro
├── register.ts                  # initAllDropzones + MutationObserver + window
├── init-dropzone.ts             # initDropzone (drag, selección, validación, remove)
├── types/                       # DropzoneOptions, StatusSetter, window.d.ts
├── const/                       # EXT_TO_MIME, EXT_ICON
└── utils/                       # options-parser, zone-creator, preview-item (+ lightbox),
                                 # upload, message
```

Helpers de formato (`formatFileSize`, `getFileExt`, `truncateFileName`) viven en
[`@fmcoldays/shared`](../shared).
