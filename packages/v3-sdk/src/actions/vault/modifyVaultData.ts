import { formatEther, getAddress, MaxUint256 } from 'ethers'

import constants from '../../constants'

import { Input, Output } from './types'


const modifyVaultData = (data: Input): Output => {
  const { vault, privateVaultAccounts } = data

  const performance = {
    mev: 7.5,
    insurance: 0,
    validators: 7,
    networkShare: 5,
    ownCapital: 8.3,
    geoDiversity: 5.2,
    clientDiversity: 9,
    validationPerformance: 8.3,
    total: Number(vault.performance),
  }

  const {
    admin,
    isErc20,
    imageUrl,
    isPrivate,
    tokenName,
    createdAt,
    tokenSymbol,
    displayName,
    description,
    whitelister,
    validatorsRoot,
  } = vault

  return {
    apy: Number(vault.avgRewardPerAsset) * 365 * 100,
    isErc20,
    imageUrl,
    isPrivate,
    tokenName,
    createdAt,
    tokenSymbol,
    performance,
    displayName,
    description,
    whitelister,
    validatorsRoot,
    whitelist: privateVaultAccounts || [],
    vaultAdmin: getAddress(admin),
    feePercent: `${vault.feePercent / 100}%`,
    totalAssets: formatEther(vault.totalAssets),
    vaultAddress: getAddress(vault.address),
    feeRecipient: getAddress(vault.feeRecipient),
    isSmoothingPool: !vault.mevEscrow,
    totalPerformance: performance.total,
    vaultKeysManager: getAddress(vault.keysManager),
    mevRecipient: vault.mevEscrow ? getAddress(vault.mevEscrow) : constants.sharedMevEscrow,
    capacity: vault.capacity !== MaxUint256.toString()
      ? formatEther(vault.capacity)
      : '∞',
  }
}


export default modifyVaultData
