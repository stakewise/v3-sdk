import type { Action } from '../util'
import { checkAccessCommon } from '../util'
import type { SetKeysManagerInput as Input } from './types'


const checkAccess = <Output>(action: Action<Input, Output>) => (
  checkAccessCommon<Input, Output>({
    action,
    check: {
      isAdmin: true,
    },
  })
)


export default checkAccess
