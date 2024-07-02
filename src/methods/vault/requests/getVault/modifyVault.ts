import { formatEther, getAddress, MaxUint256 } from 'ethers'

import { ModifiedVault } from './types'
import { Network, configs } from '../../../../utils'
import type { VaultQueryPayload } from '../../../../graphql/subgraph/vault'


type ModifyVaultInput = {
  data: VaultQueryPayload
  network: Network
}

const modifyVault = (input: ModifyVaultInput): ModifiedVault => {
  const { data, network } = input
  const { vault } = data || {}

  if (!vault) {
    throw new Error('Vault not found')
  }

  const {
    apy,
    admin,
    address,
    version,
    mevEscrow,
    createdAt,
    feePercent,
    keysManager,
    performance,
    totalAssets,
    feeRecipient,
    blocklistCount,
    whitelistCount,
    validatorsManager,
    restakeOperatorsManager,
    restakeWithdrawalsManager,
    depositDataManager: initialDepositDataManager,
    ...rest
  } = vault

  const depositDataManager = Number(version) > 1 ? initialDepositDataManager : keysManager

  return {
    ...rest,
    apy: Number(apy),
    version: Number(version),
    isSmoothingPool: !mevEscrow,
    feePercent: feePercent / 100,
    vaultAdmin: getAddress(admin),
    performance: Number(performance),
    vaultAddress: getAddress(address),
    createdAt: Number(createdAt) * 1000,
    totalAssets: formatEther(totalAssets),
    feeRecipient: getAddress(feeRecipient),
    blocklistCount: Number(blocklistCount),
    whitelistCount: Number(whitelistCount),
    keysManager: keysManager ? getAddress(keysManager) : '',
    whitelister: vault.whitelister ? getAddress(vault.whitelister) : '',
    whitelistManager: vault.whitelister ? getAddress(vault.whitelister) : '',
    validatorsManager: validatorsManager ? getAddress(validatorsManager) : '',
    depositDataManager: depositDataManager ? getAddress(depositDataManager) : '',
    blocklistManager: vault.blocklistManager ? getAddress(vault.blocklistManager) : '',
    restakeOperatorsManager: restakeOperatorsManager ? getAddress(restakeOperatorsManager) : '',
    restakeWithdrawalsManager: restakeWithdrawalsManager ? getAddress(restakeWithdrawalsManager) : '',
    mevRecipient: mevEscrow
      ? getAddress(mevEscrow)
      : configs[network].addresses.base.sharedMevEscrow,
    capacity: vault.capacity !== MaxUint256.toString()
      ? formatEther(vault.capacity)
      : '∞',
  }
}


export default modifyVault
