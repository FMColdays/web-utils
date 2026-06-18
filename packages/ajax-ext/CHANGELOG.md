# @fmcoldays/ajax-ext

## 0.2.5

### Patch Changes

- Eliminar notificaciones pill (toast). Solo quedan popup() y confirm()
- Updated dependencies
  - @fmcoldays/notify@3.0.0

## 0.2.4

### Patch Changes

- Renombrar export `toast` a `notify` y `notify()` a `popup()` en @fmcoldays/notify
- Updated dependencies
  - @fmcoldays/notify@2.0.0

## 0.2.3

### Patch Changes

- Renombrar paquete de @fmcoldays/toast a @fmcoldays/notify
- Updated dependencies
  - @fmcoldays/notify@1.0.0

## 0.2.2

### Patch Changes

- Fix data-ajax-disable afectando contenido del form en lugar del boton. Renombrar data-ajax-toast/toast-error a data-ajax-notify/notify-error con prioridad sobre mensaje del backend. Fix data-ajax-open y data-ajax-refresh-modal usando window.openModal. Fix modal renderLayout para vincular botones sin type explicito al form.

## 0.2.1

### Patch Changes

- Errores siempre muestran notify() en lugar de toast, incluso dentro de un dialog.

## 0.2.0

### Minor Changes

- Add @fmcoldays/ajax-ext package. Extiende jQuery Unobtrusive Ajax con confirmacion async (via @fmcoldays/toast confirm), loading states, notify en exito/error, dismiss, reset, redirect, reload, toggle, then y open/refreshModal declarativos via atributos data-ajax-ext-\*. Reemplaza Notiflix. Incluido en @fmcoldays/all.
