import type { MulticallTransactionInput } from './types'
import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'
import type { VaultMulticallBaseInput } from '../../../../contracts'

import {
  getMetadataParams,
  getBlocklistParams,
  getWhitelistParams,
  getWhitelisterParams,
  getFeeRecipientParams,
  getValidatorsRootParams,
  getBlocklistManagerParams,
  getValidatorsManagerParams,
  getDepositDataManagerParams,
  getRestakeOperatorsManagerParams,
  getRestakeWithdrawalsManagerParams,
} from '../util'


export const commonLogic = async (values: MulticallTransactionInput) => {
  const {
    validatorsRoot, blocklistManager, metadataIpfsHash,
    blocklist, whitelist, depositDataManager, whitelistManager, feeRecipient,
    options, contracts, userAddress, vaultAddress, provider, validatorsManager, restakeOperatorsManager, restakeWithdrawalsManager,
  } = values

  validateArgs.address({ vaultAddress, userAddress })

  let vaultContract = contracts.helpers.createVault(vaultAddress)

  if (whitelist?.length || whitelistManager) {
    if (whitelist && whitelist.length > 700) {
      throw new Error('Your transaction is likely to fail, we do not recommend passing more than 700 addresses to the whitelist at a time')
    }

    vaultContract = contracts.helpers.createPrivateVault(vaultAddress)
  }

  if (blocklist?.length || blocklistManager) {
    if (blocklist && blocklist.length > 700) {
      throw new Error('Your transaction is likely to fail, we do not recommend passing more than 700 addresses to the block list at a time')
    }

    vaultContract = contracts.helpers.createBlocklistedVault(vaultAddress)
  }

  if (restakeOperatorsManager || restakeWithdrawalsManager) {
    vaultContract = contracts.helpers.createRestakingVault(vaultAddress)
  }

  // Temporal logic while different types of vaults exist
  const version = Number(await vaultContract.version())
  const isV1Version = version === 1

  if (!isV1Version) {
    if (validatorsRoot) {
      throw new Error('To set validatorsRoot in version 2 of vault, use the vault.setDepositDataRoot() method')
    }

    if (depositDataManager) {
      throw new Error('To set depositDataManager in version 2 of vault, use the vault.setDepositDataManager() method')
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

  if (blocklist?.length) {
    const blocklistParams = getBlocklistParams({ ...baseInput, blocklist })

    params.push(...blocklistParams)
  }

  if (whitelist?.length) {
    const whitelistParams = getWhitelistParams({ ...baseInput, whitelist })

    params.push(...whitelistParams)
  }

  if (depositDataManager) {
    const depositDataManagerParams = getDepositDataManagerParams({ ...baseInput, depositDataManager })

    params.push(...depositDataManagerParams)
  }

  if (whitelistManager) {
    const whitelisterParams = getWhitelisterParams({ ...baseInput, whitelistManager })

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

  if (restakeOperatorsManager) {
    const restakeOperatorsManagerParams = getRestakeOperatorsManagerParams({ ...baseInput, restakeOperatorsManager })

    params.push(...restakeOperatorsManagerParams)
  }

  if (restakeWithdrawalsManager) {
    const restakeWithdrawalsManagerParams = getRestakeWithdrawalsManagerParams({ ...baseInput, restakeWithdrawalsManager })

    params.push(...restakeWithdrawalsManagerParams)
  }

  return {
    ...baseMulticall,
    request: {
      params,
    },
  }
}
