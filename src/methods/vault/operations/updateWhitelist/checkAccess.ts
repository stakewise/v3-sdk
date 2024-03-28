import type { Action } from '../util'
import { checkAccessCommon } from '../util'
import type { UpdateWhitelistInput as Input } from './types'


const checkAccess = <Output>(action: Action<Input, Output>) =>
  checkAccessCommon<Input, Output>({
    action,
    check: {
      isWhitelister: true,
    },
  })


export default checkAccess
