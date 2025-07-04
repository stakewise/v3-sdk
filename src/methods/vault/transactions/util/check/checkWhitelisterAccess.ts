import type { CheckInput } from './types'


const checkWhitelisterAccess = async ({ userAddress, vaultAddress, contracts }: CheckInput) => {
  try {
    const vaultContract = contracts.helpers.createVault({
      vaultAddress,
      options: { isPrivate: true },
    })

    const whitelistManager = await vaultContract.whitelister()
    const hasAccess = whitelistManager.toLowerCase() === userAddress.toLowerCase()

    if (!hasAccess) {
      return Promise.reject('User must be the vault whitelist manager to perform this action')
    }
  }
  catch (error) {
    return Promise.reject(`Failed to check whitelister access: ${error}`)
  }
}


export default checkWhitelisterAccess
