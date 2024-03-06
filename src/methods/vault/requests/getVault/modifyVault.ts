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
  const { vault } = data

  if (!vault) {
    throw new Error('Vault not found')
  }

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
    blocklistCount,
    whitelistCount,
    apy,
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
    apy: Number(apy),
    blocklistCount: Number(blocklistCount),
    whitelistCount: Number(whitelistCount),
    whitelister: vault.whitelister ? getAddress(vault.whitelister) : '',
    blocklistManager: vault.blocklistManager ? getAddress(vault.blocklistManager) : '',
    mevRecipient: mevEscrow
      ? getAddress(mevEscrow)
      : configs[network].addresses.base.sharedMevEscrow,
    capacity: vault.capacity !== MaxUint256.toString()
      ? formatEther(vault.capacity)
      : '∞',
  }
}


export default modifyVault
