# @fmcoldays/web-utils

Monorepo de utilidades web reutilizables. Lo que antes copiabas y pegabas entre
proyectos ahora vive aquí, versionado y publicado en npm. Actualizas una vez,
todos los proyectos consumen la nueva versión.

## Paquetes

| Paquete | Descripción | npm |
|---|---|---|
| [`@fmcoldays/shared`](packages/shared) | Utilidades base: HTTP (CSRF, pick, armado de body), DOM (spinner) y tipos comunes. | Interno + público |
| [`@fmcoldays/post-action`](packages/post-action) | Peticiones HTTP declarativas con `data-action-*`. | Público |
| [`@fmcoldays/modal`](packages/modal) | Carga vistas parciales Razor en un `<dialog>` vía AJAX (shell auto-inyectado, drag, tamaños). | Público |
| [`@fmcoldays/dropzone`](packages/dropzone) | Carga de archivos con drag & drop, preview y lightbox. | Público |
| [`@fmcoldays/notify`](packages/notify) | Notificaciones (toasts) y diálogo de confirmación. Sin deps externas. | Público |

`post-action`, `modal` y `dropzone` dependen de `shared`. `post-action` además usa `notify` para notificaciones/confirmación.

## Stack

- **pnpm workspaces** — gestión del monorepo y enlaces internos (`workspace:^`).
- **tsup** — build a ESM + CJS + tipos (`.d.ts`) por paquete.
- **changesets** — versionado y publicación coordinada.
- **TypeScript** estricto, sin rutas relativas profundas: alias `@/*` dentro de cada paquete.

## Comandos

```bash
pnpm install        # instala todo y enlaza paquetes internos
pnpm build          # compila todos los paquetes (dist/)
pnpm dev            # build en watch de todos los paquetes
pnpm typecheck      # type-check sin emitir
pnpm changeset      # registra un cambio (elige qué paquetes y bump)
pnpm release        # build + publica a npm lo que tenga changeset
```

## Publicar

1. `pnpm changeset` — describe el cambio y marca los paquetes afectados.
2. `pnpm version-packages` — aplica los bumps de versión y changelogs.
3. `pnpm release` — compila y publica a npm.

> Requiere `npm login` con acceso al scope `@fmcoldays`.

## Agregar una nueva utilidad

Está documentado paso a paso en [CONTRIBUTING.md](CONTRIBUTING.md). En resumen:
copiar la estructura de un paquete existente, ajustar `package.json`, escribir
el código en `src/` siguiendo la convención de carpetas (types / const /
helpers / services / utils, cada una con su barril) y exportarlo desde `src/index.ts`.

## Convenciones

- **Un barril (`index.ts`) por carpeta.** Nunca se importa un archivo profundo directamente desde fuera de su carpeta.
- **Sin rutas relativas profundas.** Dentro de un paquete se usa el alias `@/*`; entre paquetes, el nombre publicado (`@fmcoldays/shared`).
- **Side-effect free.** Importar un paquete no registra listeners; el consumidor llama explícitamente a `registerPostAction()` / `registerModal()`.
- **Dependencias externas como `peerDependencies`** (notiflix, jquery): el consumidor las provee, no se duplican en el bundle.
