import type { MulticallTransactionInput as Input } from './types'

import {
  checkAdminAccess,
  checkWhitelisterAccess,
  checkBlocklistManagerAccess,
} from '../util'


type Action<Input, Output> = (props: Input) => Promise<Output>

const checkAccess = <Output>(action: Action<Input, Output>) => (
  async (values: Input) => {
    const {
      blocklist, whitelist, whitelistManager, feeRecipient,
      blocklistManager, metadataIpfsHash, validatorsManager,
    } = values

    try {
      const result = await action(values)

      return result
    }
    catch (actionError) {
      const isAdmin = Boolean(
        whitelistManager
        || feeRecipient
        || blocklistManager
        || metadataIpfsHash
        || validatorsManager
      )
      const isWhitelistManager = Boolean(whitelist)
      const isBlocklistManager = Boolean(blocklist)

      const checkPromises = []

      if (isAdmin) {
        checkPromises.push(
          checkAdminAccess(values)
        )
      }
      if (isWhitelistManager) {
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
