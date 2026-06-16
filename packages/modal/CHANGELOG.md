# @fmcoldays/modal

## 0.6.4

### Patch Changes

- Fix initFooterSubmit: siempre usa preventDefault + requestSubmit() en lugar de depender del atributo form nativo del navegador, lo que causaba que el submit no disparara en algunos casos.

## 0.6.3

### Patch Changes

- Fix data-ajax-disable afectando contenido del form en lugar del boton. Renombrar data-ajax-toast/toast-error a data-ajax-notify/notify-error con prioridad sobre mensaje del backend. Fix data-ajax-open y data-ajax-refresh-modal usando window.openModal. Fix modal renderLayout para vincular botones sin type explicito al form.

## 0.6.2

### Patch Changes

- Initial public release
- Updated dependencies
  - @fmcoldays/shared@0.1.2
