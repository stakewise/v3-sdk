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
  const { vault, privateVaultAccounts } = data

  const {
    admin,
    address,
    mevEscrow,
    createdAt,
    feePercent,
    performance,
    keysManager,
    totalAssets,
    feeRecipient,
    avgRewardPerAsset,
    ...rest
  } = vault

  return {
    ...rest,
    isSmoothingPool: !mevEscrow,
    feePercent: feePercent / 100,
    vaultAdmin: getAddress(admin),
    performance: Number(performance),
    vaultAddress: getAddress(address),
    createdAt: Number(createdAt) * 1000,
    totalAssets: formatEther(totalAssets),
    feeRecipient: getAddress(feeRecipient),
    vaultKeysManager: getAddress(keysManager),
    apy: Number(avgRewardPerAsset) * 365 * 100,
    whitelister: vault.whitelister ? getAddress(vault.whitelister) : '',
    whitelist: privateVaultAccounts.map(({ createdAt, address }) => ({
      createdAt: Number(createdAt) * 1000,
      address: getAddress(address),
    })) || [],
    mevRecipient: mevEscrow
      ? getAddress(mevEscrow)
      : configs[network].addresses.base.sharedMevEscrow,
    capacity: vault.capacity !== MaxUint256.toString()
      ? formatEther(vault.capacity)
      : '∞',
  }
}


export default modifyVault
