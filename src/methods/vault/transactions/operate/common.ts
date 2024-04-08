import type { MulticallInput } from './types'
import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'

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
} from '../util'


export const commonLogic = async (values: MulticallInput) => {
  const {
    validatorsRoot, blocklistManager, metadataIpfsHash,
    blocklist, whitelist, depositDataManager, whitelister, feeRecipient,
    options, contracts, userAddress, vaultAddress, provider, validatorsManager,
  } = values

  validateArgs.address({ vaultAddress, userAddress })

  let vaultContract = contracts.helpers.createVault(vaultAddress)

  if (whitelist) {
    vaultContract = contracts.helpers.createPrivateVault(vaultAddress)
  }

  if (blocklist) {
    vaultContract = contracts.helpers.createBlocklistedVault(vaultAddress)
  }

  // Temporal logic while different types of vaults exist
  const version = Number(await vaultContract.version())
  const isSecondVersion = version === 2

  if (isSecondVersion) {
    if (validatorsRoot) {
      throw new Error('To set validatorsRoot in version 2 of vault, use the vault.setDepositDataRoot() method')
    }

    if (depositDataManager) {
      throw new Error('To set depositDataManager in version 2 of vault, use the vault.setDepositDataManager() method')
    }
  }

  const baseMulticall = {
    keeperContract: contracts.base.keeper,
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

  if (blocklist) {
    const blocklistParams = getBlocklistParams({ ...baseInput, blocklist })

    params.push(...blocklistParams)
  }

  if (whitelist) {
    const whitelistParams = getWhitelistParams({ ...baseInput, whitelist })

    params.push(...whitelistParams)
  }

  if (depositDataManager) {
    const depositDataManagerParams = getDepositDataManagerParams({ ...baseInput, depositDataManager })

    params.push(...depositDataManagerParams)
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
