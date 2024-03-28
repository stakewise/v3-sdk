import type { Action } from '../util'
import { checkAccessCommon } from '../util'
import type { SetValidatorsRootInput as Input } from './types'


const checkAccess = <Output>(action: Action<Input, Output>) => (
  checkAccessCommon<Input, Output>({
    action,
    check: {
      isKeysManager: true,
    },
  })
)


export default checkAccess
