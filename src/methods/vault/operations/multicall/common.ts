import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'
import type { MulticallInput } from './types'

import { getParams as getParamsSetMetadata } from '../setMetadata'
import { getParams as getParamsSetKeysManager } from '../setKeysManager'
import { getParams as getParamsSetWhitelister } from '../setWhitelister'
import { getParams as getParamsSetFeeRecipient } from '../setFeeRecipient'
import { getParams as getParamsUpdateBlocklist } from '../updateBlocklist'
import { getParams as getParamsUpdateWhitelist } from '../updateWhitelist'
import { getParams as getParamsSetValidatorsRoot } from '../setValidatorsRoot'
import { getParams as getParamsSetBlocklistManager } from '../setBlocklistManager'


export const commonLogic = (values: MulticallInput) => {
  const {
    options, contracts, userAddress, vaultAddress, provider,
    blocklist, whitelist, keysManager, whitelister, feeRecipient, validatorsRoot, blocklistManager, metadataIpfsHash,
  } = values

  validateArgs.address({ vaultAddress, userAddress })

  const baseMulticall = {
    vaultContract: contracts.helpers.createBlocklistedVault(vaultAddress),
    keeperContract: contracts.base.keeper,
    vaultAddress,
    userAddress,
    options,
  }

  const baseInput = {
    options,
    provider,
    contracts,
    userAddress,
    vaultAddress,
  }

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = []

  if (blocklist) {
    const setBlocklistParams = getParamsUpdateBlocklist({ ...baseInput, blocklist })

    params.push(...setBlocklistParams)
  }
  if (whitelist) {
    const setWhitelistParams = getParamsUpdateWhitelist({ ...baseInput, whitelist })

    params.push(...setWhitelistParams)
  }
  if (keysManager) {
    const setKeysManagerParams = getParamsSetKeysManager({ ...baseInput, keysManager })

    params.push(...setKeysManagerParams)
  }
  if (whitelister) {
    const setWhitelisterParams = getParamsSetWhitelister({ ...baseInput, whitelister })

    params.push(...setWhitelisterParams)
  }
  if (feeRecipient) {
    const setFeeRecipientParams = getParamsSetFeeRecipient({ ...baseInput, feeRecipient })

    params.push(...setFeeRecipientParams)
  }
  if (validatorsRoot) {
    const setValidatorsRootParams = getParamsSetValidatorsRoot({ ...baseInput, validatorsRoot })

    params.push(...setValidatorsRootParams)
  }
  if (blocklistManager) {
    const setBlocklistManagerParams = getParamsSetBlocklistManager({ ...baseInput, blocklistManager })

    params.push(...setBlocklistManagerParams)
  }
  if (metadataIpfsHash) {
    const setMetadataParams = getParamsSetMetadata({ ...baseInput, metadataIpfsHash })

    params.push(...setMetadataParams)
  }

  return {
    ...baseMulticall,
    request: {
      params,
    },
  }
}
