# @fmcoldays/ajax-ext

## 0.2.2

### Patch Changes

- Fix data-ajax-disable afectando contenido del form en lugar del boton. Renombrar data-ajax-toast/toast-error a data-ajax-notify/notify-error con prioridad sobre mensaje del backend. Fix data-ajax-open y data-ajax-refresh-modal usando window.openModal. Fix modal renderLayout para vincular botones sin type explicito al form.

## 0.2.1

### Patch Changes

- Errores siempre muestran notify() en lugar de toast, incluso dentro de un dialog.

## 0.2.0

### Minor Changes

- Add @fmcoldays/ajax-ext package. Extiende jQuery Unobtrusive Ajax con confirmacion async (via @fmcoldays/toast confirm), loading states, notify en exito/error, dismiss, reset, redirect, reload, toggle, then y open/refreshModal declarativos via atributos data-ajax-ext-\*. Reemplaza Notiflix. Incluido en @fmcoldays/all.
