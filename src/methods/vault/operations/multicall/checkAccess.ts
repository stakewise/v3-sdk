import type { Action } from '../util'
import { checkAccessCommon } from '../util'
import type { MulticallInput as Input } from './types'


const checkAccess = <Output>(action: Action<Input, Output>) => {
  return (values: Input) => {
    const {
      blocklist, whitelist, keysManager, whitelister, feeRecipient, validatorsRoot, blocklistManager, metadataIpfsHash,
    } = values

    const wrappedAction = checkAccessCommon<Input, Output>({
      action,
      check: {
        isAdmin: Boolean(whitelister || keysManager || feeRecipient || blocklistManager || metadataIpfsHash),
        isKeysManager: Boolean(validatorsRoot),
        isWhitelister: Boolean(whitelist),
        isBlocklistManager: Boolean(blocklist),
      },
    })

    return wrappedAction(values)
  }
}


export default checkAccess
