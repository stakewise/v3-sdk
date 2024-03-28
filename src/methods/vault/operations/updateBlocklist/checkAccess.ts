import type { Action } from '../util'
import { checkAccessCommon } from '../util'
import type { UpdateBlocklistInput as Input } from './types'


const checkAccess = <Output>(action: Action<Input, Output>) => (
  checkAccessCommon<Input, Output>({
    action,
    check: {
      isBlocklistManager: true,
    },
  })
)


export default checkAccess
