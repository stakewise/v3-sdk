import { constants } from 'helpers'
import { getAddress } from 'ethers'
import { VaultQueryPayload } from 'graphql/subgraph/vault'

import { ModifiedVault } from './types'


const modifyVaultData = (data: VaultQueryPayload): ModifiedVault => {
  const { vault, privateVaultAccounts } = data

  const { admin, address, feePercent, feeRecipient, mevEscrow, keysManager, avgRewardPerAsset, ...rest } = vault

  return {
    ...rest,
    isSmoothingPool: !mevEscrow,
    feePercent: feePercent / 100,
    vaultAdmin: getAddress(admin),
    vaultAddress: getAddress(address),
    whitelist: privateVaultAccounts || [],
    feeRecipient: getAddress(feeRecipient),
    vaultKeysManager: getAddress(keysManager),
    apy: Number(avgRewardPerAsset) * 365 * 100,
    mevRecipient: mevEscrow ? getAddress(mevEscrow) : constants.sharedMevEscrow,
  }
}


export default modifyVaultData
