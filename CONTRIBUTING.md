# Cómo agregar una nueva utilidad

Esta guía existe para que mañana —tú o cualquiera— pueda agregar una utilidad
nueva sin pensar en el "cómo" estructural. Todo paquete sigue el mismo molde.

## 1. Crear la carpeta del paquete

```
packages/<nombre>/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── README.md
└── src/
    └── index.ts        # barril raíz del paquete
```

La forma más rápida: copia `packages/post-action/` completo y renómbralo.

## 2. Ajustar `package.json`

Cambia solo lo propio del paquete; el resto del molde se queda igual:

- `"name"`: `@fmcoldays/<nombre>`
- `"description"`, `"keywords"`
- `"version"`: empieza en `0.1.0`
- `"dependencies"`: agrega `"@fmcoldays/shared": "workspace:^"` si reutilizas la lógica común.
- `"peerDependencies"`: librerías externas que provee el consumidor (ej. `jquery`, `notiflix`).

`tsconfig.json` y `tsup.config.ts` son idénticos en todos los paquetes — no los toques.

## 3. Estructura interna de `src/`

Separa por responsabilidad. Usa solo las carpetas que necesites; **cada una
lleva su barril `index.ts`** que reexporta sus archivos:

| Carpeta | Para qué | Sufijo de archivo |
|---|---|---|
| `types/` | interfaces y tipos | `*.type.ts` |
| `const/` | constantes y selectores | `*.const.ts` |
| `helpers/` | funciones puras de apoyo | `*.helper.ts` |
| `services/` | acceso a red / side effects | `*.service.ts` |
| `utils/` | utilidades de DOM/UI | `*.util.ts` |
| `templates/` | HTML como string | `*.template.ts` |

Convención de imports:

- **Dentro del paquete** → alias `@/*` (ej. `import { foo } from '@/helpers'`). Nunca `../../`.
- **Entre paquetes** → nombre publicado (ej. `import { buildHttpPayload } from '@fmcoldays/shared'`).
- **Fuera, hacia un archivo profundo** → prohibido. Siempre pasa por el barril de la carpeta.

## 4. El barril raíz (`src/index.ts`)

Reexporta los barriles de cada carpeta y la API pública (función de registro,
entrada programática):

```ts
export * from '@/types'
export * from '@/helpers'
export { registerMiUtilidad } from '@/register'
```

## 5. Registro explícito (sin side-effects)

No registres listeners al importar. Exporta una función `register…()` que el
consumidor llama una vez. Hazla idempotente (quita el listener antes de añadirlo)
y devuelve una función para desregistrar. Mira `packages/post-action/src/register.ts`.

## 6. Reutiliza `@fmcoldays/shared`

Antes de escribir lógica de HTTP (CSRF, query string, body JSON/FormData, pick)
o de DOM (spinner), revisa si ya está en `shared`. Si no está y la vas a usar en
más de un paquete, agrégala ahí.

## 7. Probar y publicar

```bash
pnpm install      # enlaza el nuevo paquete
pnpm typecheck    # valida tipos
pnpm build        # compila a dist/
pnpm changeset    # registra el cambio para publicar
```
