import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'
import type { MulticallInput } from './types'

import getMetadataParams from './util/params/getMetadataParams'
import getBlocklistParams from './util/params/getBlocklistParams'
import getWhitelistParams from './util/params/getWhitelistParams'
import getKeysManagerParams from './util/params/getKeysManagerParams'
import getWhitelisterParams from './util/params/getWhitelisterParams'
import getFeeRecipientParams from './util/params/getFeeRecipientParams'
import getValidatorsRootParams from './util/params/getValidatorsRootParams'
import getBlocklistManagerParams from './util/params/getBlocklistManagerParams'


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
    const blocklistParams = getBlocklistParams({ ...baseInput, blocklist })

    params.push(...blocklistParams)
  }
  if (whitelist) {
    const whitelistParams = getWhitelistParams({ ...baseInput, whitelist })

    params.push(...whitelistParams)
  }
  if (keysManager) {
    const keysManagerParams = getKeysManagerParams({ ...baseInput, keysManager })

    params.push(...keysManagerParams)
  }
  if (whitelister) {
    const whitelisterParams = getWhitelisterParams({ ...baseInput, whitelister })

    params.push(...whitelisterParams)
  }
  if (feeRecipient) {
    const feeRecipientParams = getFeeRecipientParams({ ...baseInput, feeRecipient })

    params.push(...feeRecipientParams)
  }
  if (validatorsRoot) {
    const validatorsRootParams = getValidatorsRootParams({ ...baseInput, validatorsRoot })

    params.push(...validatorsRootParams)
  }
  if (metadataIpfsHash) {
    const metadataParams = getMetadataParams({ ...baseInput, metadataIpfsHash })

    params.push(...metadataParams)
  }
  if (blocklistManager) {
    const blocklistManagerParams = getBlocklistManagerParams({ ...baseInput, blocklistManager })

    params.push(...blocklistManagerParams)
  }

  return {
    ...baseMulticall,
    request: {
      params,
    },
  }
}
