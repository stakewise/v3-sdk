import { checkKeysManagerAccess } from '../util'
import type { SetDepositDataRootInput as Input } from './types'


type Action<Input, Output> = (props: Input) => Promise<Output>

const checkAccess = <Output>(action: Action<Input, Output>) => (
  async (values: Input) => {
    try {
      const result = await action(values)

      return result
    }
    catch (actionError) {
      return checkKeysManagerAccess(values)
        .then(
          () => Promise.reject(actionError),
          (error) => Promise.reject(error)
        )
    }
  }
)


export default checkAccess
