import type { CheckInput } from './types'


const checkWhitelisterAccess = async ({ userAddress, vaultAddress, contracts }: CheckInput) => {
  try {
    const vaultContract = await contracts.helpers.createPrivateVault(vaultAddress)
    const whitelistManager = await vaultContract.whitelister()
    const hasAccess = whitelistManager.toLowerCase() === userAddress.toLowerCase()

    if (!hasAccess) {
      return Promise.reject('User must be the vault whitelist manager to perform this action')
    }
  }
  catch {}
}


export default checkWhitelisterAccess
