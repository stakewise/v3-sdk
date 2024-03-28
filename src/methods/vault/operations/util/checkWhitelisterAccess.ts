import type { CheckInput } from './types'


const checkWhitelisterAccess = async ({ userAddress, vaultAddress, contracts }: CheckInput) => {
  try {
    const vaultContract = await contracts.helpers.createPrivateVault(vaultAddress)
    const whitelister = await vaultContract.whitelister()
    const hasAccess = whitelister.toLowerCase() === userAddress.toLowerCase()

    if (!hasAccess) {
      return Promise.reject('User must be the vault whitelister to perform this action')
    }
  }
  catch {}
}


export default checkWhitelisterAccess
