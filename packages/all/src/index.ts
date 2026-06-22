import '@fmcoldays/post-action'
import '@fmcoldays/modal'
import '@fmcoldays/dropzone'

import { PostAction, type PostActionConfig, fieldEquals, fieldNotEquals } from '@fmcoldays/post-action'
import type { ModalReadyEvent } from '@fmcoldays/modal'
export { fieldEquals, fieldNotEquals }
export type { ModalReadyEvent }

export interface AllConfig {
  postAction?: PostActionConfig
}

export function configure(options: AllConfig): void {
  if (options.postAction) PostAction.configure(options.postAction)
}
