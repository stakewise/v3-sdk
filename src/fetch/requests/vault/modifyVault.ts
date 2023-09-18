import { Network, config } from 'helpers'
import { VaultQueryPayload } from 'graphql/subgraph/vault'
import { formatEther, getAddress, MaxUint256 } from 'ethers'

import { ModifiedVault } from './types'


type ModifyVaultInput = {
  data: VaultQueryPayload
  network: Network
}

const modifyVault = (values: ModifyVaultInput): ModifiedVault => {
  const { data, network } = values
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
    performance: {
      total: Number(performance),
    },
    isSmoothingPool: !mevEscrow,
    feePercent: feePercent / 100,
    vaultAdmin: getAddress(admin),
    vaultAddress: getAddress(address),
    createdAt: Number(createdAt) * 1000,
    totalAssets: formatEther(totalAssets),
    feeRecipient: getAddress(feeRecipient),
    vaultKeysManager: getAddress(keysManager),
    apy: Number(avgRewardPerAsset) * 365 * 100,
    whitelist: privateVaultAccounts.map(({ createdAt, address }) => ({
      createdAt: Number(createdAt) * 1000,
      address: getAddress(address),
    })) || [],
    mevRecipient: mevEscrow
      ? getAddress(mevEscrow)
      : config[network].sharedMevEscrow,
    capacity: vault.capacity !== MaxUint256.toString()
      ? formatEther(vault.capacity)
      : '∞',
  }
}


export default modifyVault
