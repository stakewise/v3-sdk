import { validateArgs } from '../../../../helpers'
import type { OperateTransactionInput } from './types'
import { vaultMulticall } from '../../../../contracts'
import type { VaultMulticallBaseInput } from '../../../../contracts'

import {
  getAdminParams,
  getMetadataParams,
  getBlocklistParams,
  getWhitelistParams,
  getFeePercentParams,
  getAddSubVaultParams,
  getWhitelisterParams,
  getFeeRecipientParams,
  getEjectSubVaultParams,
  getRejectSubVaultParams,
  getBlocklistManagerParams,
  getValidatorsManagerParams,
} from '../util'


export const commonLogic = async (values: OperateTransactionInput) => {
  const {
    blocklistManager, metadataIpfsHash, admin, feePercent,
    blocklist, whitelist, whitelistManager, feeRecipient, subVaultAddress, ejectSubVaultAddress,
    options, contracts, userAddress, vaultAddress, provider, validatorsManager, rejectMetaSubVaultAddress,
  } = values

  validateArgs.address({ vaultAddress, userAddress })

  const chainId = options.network
  const isPrivate = Boolean(whitelist?.length || whitelistManager)
  const isBlocklist = Boolean(blocklist?.length || blocklistManager)
  const isMetaVault = Boolean(subVaultAddress || ejectSubVaultAddress || rejectMetaSubVaultAddress)

  const vaultContract = contracts.helpers.createVault({
    vaultAddress,
    options: {
      chainId,
      isPrivate,
      isMetaVault,
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

  if (feePercent) {
    const feePercentParams = getFeePercentParams({ ...baseInput, feePercent })

    params.push(...feePercentParams)
  }

  if (admin) {
    const adminParams = getAdminParams({ ...baseInput, admin })

    params.push(...adminParams)
  }

  if (subVaultAddress) {
    const addSubVaultParams = getAddSubVaultParams({ ...baseInput, subVaultAddress })

    params.push(...addSubVaultParams)
  }

  if (ejectSubVaultAddress) {
    const ejectSubVaultParams = getEjectSubVaultParams({ ...baseInput, ejectSubVaultAddress })

    params.push(...ejectSubVaultParams)
  }

  if (rejectMetaSubVaultAddress) {
    const rejectSubVaultParams = getRejectSubVaultParams({ ...baseInput, rejectMetaSubVaultAddress })

    params.push(...rejectSubVaultParams)
  }

  return {
    ...baseMulticall,
    request: {
      params,
    },
  }
}
