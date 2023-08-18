import { getAddress } from 'ethers'

import constants from '../../constants'

import { Input, Output } from './types'


const modifyVaultData = (data: Input): Output => {
  const { vault, privateVaultAccounts } = data

  const { admin, address, feePercent, feeRecipient, mevEscrow, keysManager, avgRewardPerAsset, ...rest } = vault

  return {
    ...rest,
    whitelist: privateVaultAccounts || [],
    apy: Number(avgRewardPerAsset) * 365 * 100,
    vaultAdmin: getAddress(admin),
    feePercent: feePercent / 100,
    vaultAddress: getAddress(address),
    feeRecipient: getAddress(feeRecipient),
    isSmoothingPool: !mevEscrow,
    vaultKeysManager: getAddress(keysManager),
    mevRecipient: mevEscrow ? getAddress(mevEscrow) : constants.sharedMevEscrow,
  }
}


export default modifyVaultData
