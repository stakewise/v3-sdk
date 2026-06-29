import { vaultMulticall } from '../../../../contracts'
import { parseArgs, baseInputSchema } from '../../../../helpers'
import type { VaultMulticallBaseInput } from '../../../../contracts'

import {
  getAdminParams,
  getMetadataParams,
  getBlocklistParams,
  getWhitelistParams,
  getFeePercentParams,
  getWhitelisterParams,
  getFeeRecipientParams,
  getBlocklistManagerParams,
  getValidatorsManagerParams,
} from '../util'

import type { OperateTransactionInput } from './types'


export const commonLogic = async (values: OperateTransactionInput) => {
  const {
    blocklistManager, metadataIpfsHash, admin, feePercent,
    blocklist, whitelist, whitelistManager, feeRecipient,
    options, contracts, userAddress, vaultAddress, provider, validatorsManager,
  } = values

  parseArgs(baseInputSchema, values)

  const isPrivate = Boolean(whitelist?.length || whitelistManager)
  const isBlocklist = Boolean(blocklist?.length || blocklistManager)

  const vaultContract = contracts.helpers.createVault({
    vaultAddress,
    options: {
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
    ...values,
  }

  const baseInput = {
    options,
    provider,
    contracts,
    userAddress,
    vaultAddress,
  }

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = []

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

  if (typeof feePercent !== 'undefined') {
    const feePercentParams = getFeePercentParams({ ...baseInput, feePercent })

    params.push(...feePercentParams)
  }

  if (admin) {
    const adminParams = getAdminParams({ ...baseInput, admin })

    params.push(...adminParams)
  }

  return {
    ...baseMulticall,
    request: {
      params,
    },
  }
}
