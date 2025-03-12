import { formatEther, getAddress, MaxUint256 } from 'ethers'

import type { ModifiedVault } from './types'
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
    // baseApy,
    mevEscrow,
    createdAt,
    feePercent,
    performance,
    totalAssets,
    whitelister,
    feeRecipient,
    osTokenConfig,
    blocklistCount,
    whitelistCount,
    validatorsManager,
    depositDataManager,
    allocatorMaxBoostApy,
    osTokenHolderMaxBoostApy,
    ...rest
  } = vault

  return {
    ...rest,
    apy: Number(apy),
    // baseApy: Number(baseApy),
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
    allocatorMaxBoostApy: Number(allocatorMaxBoostApy),
    osTokenHolderMaxBoostApy: Number(osTokenHolderMaxBoostApy),
    whitelistManager: whitelister ? getAddress(whitelister) : '',
    validatorsManager: validatorsManager ? getAddress(validatorsManager) : '',
    depositDataManager: depositDataManager ? getAddress(depositDataManager) : '',
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
