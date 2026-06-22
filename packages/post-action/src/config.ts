export type SuccessRule = (data: Record<string, unknown>) => boolean | undefined
export type ErrorRule  = (data: Record<string, unknown>) => boolean | undefined

export interface PostActionConfig {
  successRules?: SuccessRule[]
  errorRules?:   ErrorRule[]
}

/**
 * Crea una regla que evalúa si un campo del JSON es igual a un valor.
 * Si el campo no existe en la respuesta, la regla no aplica.
 *
 * @example
 * configure({ successRules: [fieldEquals('id', 200)] })
 */
export function fieldEquals(field: string, value: unknown): SuccessRule {
  return (data) => field in data ? data[field] === value : undefined
}

/**
 * Crea una regla que evalúa si un campo del JSON es diferente a un valor.
 * Si el campo no existe en la respuesta, la regla no aplica.
 *
 * @example
 * configure({ errorRules: [fieldNotEquals('id', 200)] })
 */
export function fieldNotEquals(field: string, value: unknown): ErrorRule {
  return (data) => field in data ? data[field] !== value : undefined
}

const _config: Required<PostActionConfig> = {
  successRules: [],
  errorRules:   [],
}

export function getConfig(): Required<PostActionConfig> {
  return _config
}

export const PostAction = {
  configure(options: PostActionConfig): void {
    if (options.successRules) _config.successRules = options.successRules
    if (options.errorRules)   _config.errorRules   = options.errorRules
  },
}
