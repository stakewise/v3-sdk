import { formatEther, getAddress, MaxUint256 } from 'ethers'

import type { ModifiedVault } from './types'
import { Network, configs } from '../../../../helpers'
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
    baseApy,
    mevEscrow,
    createdAt,
    feePercent,
    performance,
    totalAssets,
    whitelister,
    feeRecipient,
    exitingAssets,
    osTokenConfig,
    blocklistCount,
    lastFeePercent,
    whitelistCount,
    exitingTickets,
    ejectingSubVault,
    validatorsManager,
    subVaultsRegistry,
    depositDataManager,
    pendingMetaSubVault,
    allocatorMaxBoostApy,
    ...rest
  } = vault

  return {
    ...rest,
    apy: Number(apy),
    baseApy: Number(baseApy),
    version: Number(version),
    isSmoothingPool: !mevEscrow,
    feePercent: feePercent / 100,
    vaultAdmin: getAddress(admin),
    performance: Number(performance),
    vaultAddress: getAddress(address),
    createdAt: Number(createdAt) * 1000,
    lastFeePercent: lastFeePercent / 100,
    totalAssets: formatEther(totalAssets),
    feeRecipient: getAddress(feeRecipient),
    blocklistCount: Number(blocklistCount),
    whitelistCount: Number(whitelistCount),
    exitingAssets: formatEther(exitingAssets),
    exitingTickets: formatEther(exitingTickets),
    allocatorMaxBoostApy: Number(allocatorMaxBoostApy),
    whitelistManager: whitelister ? getAddress(whitelister) : '',
    ejectingSubVault: ejectingSubVault ? getAddress(ejectingSubVault) : '',
    validatorsManager: validatorsManager ? getAddress(validatorsManager) : '',
    subVaultsRegistry: subVaultsRegistry ? getAddress(subVaultsRegistry) : '',
    depositDataManager: depositDataManager ? getAddress(depositDataManager) : '',
    pendingMetaSubVault: pendingMetaSubVault ? getAddress(pendingMetaSubVault) : '',
    blocklistManager: vault.blocklistManager ? getAddress(vault.blocklistManager) : '',
    mevRecipient: mevEscrow
      ? getAddress(mevEscrow)
      : configs[network].addresses.base.sharedMevEscrow,
    capacity: vault.capacity !== MaxUint256.toString()
      ? formatEther(vault.capacity)
      : '∞',
    osTokenConfig: {
      ltvPercent: osTokenConfig.ltvPercent,
      liqThresholdPercent: osTokenConfig.liqThresholdPercent,
    },
  }
}


export default modifyVault
