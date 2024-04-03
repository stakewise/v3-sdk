import type { MulticallInput as Input } from './types'

import {
  checkAdminAccess,
  checkKeysManagerAccess,
  checkWhitelisterAccess,
  checkBlocklistManagerAccess,
} from '../util'


type Action<Input, Output> = (props: Input) => Promise<Output>

const checkAccess = <Output>(action: Action<Input, Output>) => (
  async (values: Input) => {
    const {
      blocklist, whitelist, keysManager, whitelister, feeRecipient,
      validatorsRoot, blocklistManager, metadataIpfsHash,
    } = values

    try {
      const result = await action(values)

      return result
    }
    catch (actionError) {
      const isAdmin = Boolean(whitelister || keysManager || feeRecipient || blocklistManager || metadataIpfsHash)
      const isKeysManager = Boolean(validatorsRoot)
      const isWhitelister = Boolean(whitelist)
      const isBlocklistManager = Boolean(blocklist)

      const checkPromises = []

      if (isAdmin) {
        checkPromises.push(
          checkAdminAccess(values)
        )
      }
      if (isKeysManager) {
        checkPromises.push(
          checkKeysManagerAccess(values)
        )
      }
      if (isWhitelister) {
        checkPromises.push(
          checkWhitelisterAccess(values)
        )
      }
      if (isBlocklistManager) {
        checkPromises.push(
          checkBlocklistManagerAccess(values)
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


export default checkAccess
