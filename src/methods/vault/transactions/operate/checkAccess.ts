import type { MulticallInput as Input } from './types'

import {
  checkAdminAccess,
  checkWhitelisterAccess,
  checkBlocklistManagerAccess,
  checkDepositDataManagerAccess,
} from '../util'


type Action<Input, Output> = (props: Input) => Promise<Output>

const checkAccess = <Output>(action: Action<Input, Output>) => (
  async (values: Input) => {
    const {
      blocklist, whitelist, depositDataManager, whitelister, feeRecipient,
      validatorsRoot, blocklistManager, metadataIpfsHash, validatorsManager,
    } = values

    try {
      const result = await action(values)

      return result
    }
    catch (actionError) {
      const isAdmin = Boolean(
        whitelister
        || feeRecipient
        || blocklistManager
        || metadataIpfsHash
        || validatorsManager
        || depositDataManager
      )

      const isWhitelister = Boolean(whitelist)
      const isDepositData = Boolean(validatorsRoot)
      const isBlocklistManager = Boolean(blocklist)

      const checkPromises = []

      if (isAdmin) {
        checkPromises.push(
          checkAdminAccess(values)
        )
      }
      if (isDepositData) {
        checkPromises.push(
          checkDepositDataManagerAccess(values)
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