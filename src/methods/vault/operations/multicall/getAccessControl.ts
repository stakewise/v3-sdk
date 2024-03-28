import type { MulticallInput } from './types'


const getAccessControl = (values: MulticallInput) => {
  const {
    blocklist, whitelist, keysManager, whitelister, feeRecipient, validatorsRoot, blocklistManager, metadataIpfsHash,
  } = values

  return {
    isAdmin: Boolean(whitelister || keysManager || feeRecipient || blocklistManager || metadataIpfsHash),
    isKeysManager: Boolean(validatorsRoot),
    isWhitelister: Boolean(whitelist),
    isBlocklistManager: Boolean(blocklist),
  }
}


export default getAccessControl
