import { validateArgs } from '../../../../utils'
import type { MulticallTransactionInput } from './types'
import { vaultMulticall } from '../../../../contracts'
import type { VaultMulticallBaseInput } from '../../../../contracts'

import {
  getAdminParams,
  getMetadataParams,
  getBlocklistParams,
  getWhitelistParams,
  getWhitelisterParams,
  getFeeRecipientParams,
  getBlocklistManagerParams,
  getValidatorsManagerParams,
} from '../util'


export const commonLogic = async (values: MulticallTransactionInput) => {
  const {
    blocklistManager, metadataIpfsHash, admin,
    blocklist, whitelist, whitelistManager, feeRecipient,
    options, contracts, userAddress, vaultAddress, provider, validatorsManager,
  } = values

  validateArgs.address({ vaultAddress, userAddress })

  const chainId = options.network
  const isPrivate = Boolean(whitelist?.length || whitelistManager)
  const isBlocklist = Boolean(blocklist?.length || blocklistManager)

  const vaultContract = contracts.helpers.createVault({
    vaultAddress,
    options: {
      chainId,
      isPrivate,
      isBlocklist,
    },
  })

  // @ts-ignore: boolean + boolean
  if (isPrivate + isBlocklist >= 2) {
    throw new Error('You are trying to change the data for different vaults types')
  }

  if (isPrivate) {
    if (whitelist && whitelist.length > 700) {
      throw new Error('Your transaction is likely to fail, we do not recommend passing more than 700 addresses to the whitelist at a time')
    }
  }

  if (isBlocklist) {
    if (blocklist && blocklist.length > 700) {
      throw new Error('Your transaction is likely to fail, we do not recommend passing more than 700 addresses to the block list at a time')
    }
  }

  const baseMulticall: VaultMulticallBaseInput = {
    vaultContract,
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

  if (admin) {
    const adminParams = getAdminParams({ ...baseInput, admin })

    params.push(...adminParams)
  }

  if (blocklist?.length) {
    const blocklistParams = getBlocklistParams({ ...baseInput, blocklist })

    params.push(...blocklistParams)
  }

  if (whitelist?.length) {
    const whitelistParams = getWhitelistParams({ ...baseInput, whitelist })

    params.push(...whitelistParams)
  }

  if (whitelistManager) {
    const whitelisterParams = getWhitelisterParams({ ...baseInput, whitelistManager })

    params.push(...whitelisterParams)
  }

  if (feeRecipient) {
    const feeRecipientParams = getFeeRecipientParams({ ...baseInput, feeRecipient })

    params.push(...feeRecipientParams)
  }

  if (typeof metadataIpfsHash !== 'undefined') {
    const metadataParams = getMetadataParams({ ...baseInput, metadataIpfsHash })

    params.push(...metadataParams)
  }

  if (blocklistManager) {
    const blocklistManagerParams = getBlocklistManagerParams({ ...baseInput, blocklistManager })

    params.push(...blocklistManagerParams)
  }

  if (validatorsManager) {
    const validatorsManagerParams = getValidatorsManagerParams({ ...baseInput, validatorsManager })

    params.push(...validatorsManagerParams)
  }

  return {
    ...baseMulticall,
    request: {
      params,
    },
  }
}
