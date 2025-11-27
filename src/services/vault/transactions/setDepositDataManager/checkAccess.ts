import { checkAdminAccess } from '../util'
import type { SetDepositDataManagerInput as Input } from './types'


type Action<Input, Output> = (values: Input) => Promise<Output>

const checkAccess = <Output>(action: Action<Input, Output>) => (
  async (values: Input) => {
    try {
      const result = await action(values)

      return result
    }
    catch (actionError) {
      return checkAdminAccess(values)
        .then(
          () => Promise.reject(actionError),
          (error) => Promise.reject(error)
        )
    }
  }
)


export default checkAccess
