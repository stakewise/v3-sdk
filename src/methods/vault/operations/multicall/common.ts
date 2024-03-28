import { vaultMulticall } from '../../../../contracts'
import type { MulticallInput } from './types'

import { commonLogic as setMetadataCommon } from '../setMetadata/common'
import { commonLogic as setKeysManagerCommon } from '../setKeysManager/common'
import { commonLogic as setWhitelisterCommon } from '../setWhitelister/common'
import { commonLogic as setFeeRecipientCommon } from '../setFeeRecipient/common'
import { commonLogic as updateBlocklistCommon } from '../updateBlocklist/common'
import { commonLogic as updateWhitelistCommon } from '../updateWhitelist/common'
import { commonLogic as setValidatorsRootCommon } from '../setValidatorsRoot/common'
import { commonLogic as setBlocklistManagerCommon } from '../setBlocklistManager/common'


export const commonLogic = (values: MulticallInput) => {
  const {
    options, contracts, userAddress, vaultAddress, provider,
    blocklist, whitelist, keysManager, whitelister, feeRecipient, validatorsRoot, blocklistManager, metadataIpfsHash,
  } = values

  const baseMulticallArgs = {
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
    const setBlocklistCommonArgs = updateBlocklistCommon({ ...baseInput, blocklist })

    params.push(...setBlocklistCommonArgs.request.params)
  }
  if (whitelist) {
    const setWhitelistCommonArgs = updateWhitelistCommon({ ...baseInput, whitelist })

    params.push(...setWhitelistCommonArgs.request.params)
  }
  if (keysManager) {
    const setKeysManagerCommonArgs = setKeysManagerCommon({ ...baseInput, keysManager })

    params.push(...setKeysManagerCommonArgs.request.params)
  }
  if (whitelister) {
    const setWhitelisterCommonArgs = setWhitelisterCommon({ ...baseInput, whitelister })

    params.push(...setWhitelisterCommonArgs.request.params)
  }
  if (feeRecipient) {
    const setFeeRecipientCommonArgs = setFeeRecipientCommon({ ...baseInput, feeRecipient })

    params.push(...setFeeRecipientCommonArgs.request.params)
  }
  if (validatorsRoot) {
    const setValidatorsRootCommonArgs = setValidatorsRootCommon({ ...baseInput, validatorsRoot })

    params.push(...setValidatorsRootCommonArgs.request.params)
  }
  if (blocklistManager) {
    const setBlocklistManagerCommonArgs = setBlocklistManagerCommon({ ...baseInput, blocklistManager })

    params.push(...setBlocklistManagerCommonArgs.request.params)
  }
  if (metadataIpfsHash) {
    const setMetadataCommonArgs = setMetadataCommon({ ...baseInput, metadataIpfsHash })

    params.push(...setMetadataCommonArgs.request.params)
  }

  return {
    ...baseMulticallArgs,
    request: {
      params,
    },
  }
}
