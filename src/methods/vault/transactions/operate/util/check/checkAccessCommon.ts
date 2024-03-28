import type { CheckInput } from './types'
import checkAdminAccess from './checkAdminAccess'
import checkWhitelisterAccess from './checkWhitelisterAccess'
import checkKeysManagerAccess from './checkKeysManagerAccess'
import checkBlocklistManagerAccess from './checkBlocklistManagerAccess'


type Action<Input, Output> = (props: Input) => Promise<Output>

type CommonInput<Input, Output> = {
  action: Action<Input, Output>
  check: {
    isAdmin?: boolean
    isKeysManager?: boolean
    isWhitelister?: boolean
    isBlocklistManager?: boolean
  }
}

const checkAccessCommon = <Input extends CheckInput, Output>({ action, check }: CommonInput<Input, Output>): Action<Input, Output> => (
  async (props) => {
    try {
      const result = await action(props)

      return result
    }
    catch (actionError) {
      const { isAdmin, isKeysManager, isWhitelister, isBlocklistManager } = check

      const checkPromises = []

      if (isAdmin) {
        checkPromises.push(
          checkAdminAccess(props)
        )
      }
      if (isKeysManager) {
        checkPromises.push(
          checkKeysManagerAccess(props)
        )
      }
      if (isWhitelister) {
        checkPromises.push(
          checkWhitelisterAccess(props)
        )
      }
      if (isBlocklistManager) {
        checkPromises.push(
          checkBlocklistManagerAccess(props)
        )
      }

      return Promise.all(checkPromises)
        .then(
          () => Promise.reject(actionError),
          (error) => Promise.reject(error)
        )
    }
  }
)


export default checkAccessCommon
