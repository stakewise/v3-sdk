import { formatEther, getAddress, MaxUint256 } from 'ethers'

import { ModifiedVault } from './types'
import { Network, configs } from '../../../../utils'
import type { VaultQueryPayload } from '../../../../graphql/subgraph/vault'


type ModifyVaultInput = {
  data: VaultQueryPayload
  network: Network
}

const modifyAddress = ({ createdAt, address }: { createdAt: string, address: string }) => ({
  createdAt: Number(createdAt) * 1000,
  address: getAddress(address),
})

const modifyVault = (input: ModifyVaultInput): ModifiedVault => {
  const { data, network } = input
  const { vault, privateVaultAccounts, vaultBlockedAccounts } = data

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
    weeklyApy,
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
    apy: Number(weeklyApy),
    whitelister: vault.whitelister ? getAddress(vault.whitelister) : '',
    blocklistManager: vault.blocklistManager ? getAddress(vault.blocklistManager) : '',
    whitelist: privateVaultAccounts.map(modifyAddress),
    blocklist: vaultBlockedAccounts.map(modifyAddress),
    mevRecipient: mevEscrow
      ? getAddress(mevEscrow)
      : configs[network].addresses.base.sharedMevEscrow,
    capacity: vault.capacity !== MaxUint256.toString()
      ? formatEther(vault.capacity)
      : '∞',
  }
}


export default modifyVault
