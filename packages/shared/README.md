# @fmcoldays/shared

Utilidades base compartidas por los demás paquetes de fmcoldays. Centraliza la
lógica de HTTP, DOM y tipos para no duplicarla.

```bash
pnpm add @fmcoldays/shared
```

## API

### HTTP

```ts
import { buildHttpPayload, resolvePick, resolveCsrfToken, applyCsrfHeader } from '@fmcoldays/shared'

// Arma URL, método, headers y body a partir de datos declarativos.
const { url, method, headers, body, isFormData } = buildHttpPayload({
  url: '/api/items',
  method: 'POST',           // opcional: POST si hay body, GET si no
  bodyJson: '{"tipo":"sensor"}',
  pick: { nombre: '#input-nombre' },
  csrf: true,
})
```

- `buildHttpPayload(input)` — GET → todo al query string; POST → FormData o JSON.
- `resolvePick(map)` — `{ campo: selector }` → `{ campo: valor }` leído del DOM.
- `resolveCsrfToken()` — lee el token del input antiforgery o del meta tag.
- `applyCsrfHeader(headers, enabled)` — añade el header CSRF si procede.

### DOM

```ts
import { showSpinner, hideSpinner, configureSpinner, queryRequired } from '@fmcoldays/shared'

configureSpinner('#mi-spinner')   // opcional; default '.spinner__contenedor'
showSpinner()
hideSpinner()

const el = queryRequired<HTMLFormElement>('#mi-form') // lanza si no existe
```

### Tipos

```ts
import type { ApiResponse, FileOperationResult } from '@fmcoldays/shared'
```

## Estructura

```
src/
├── index.ts            # barril raíz
├── types/              # ApiResponse, FileOperationResult
├── const/              # selectores y nombres de header
├── dom/                # spinner, queryRequired
└── http/               # pick, csrf, request-payload
```
