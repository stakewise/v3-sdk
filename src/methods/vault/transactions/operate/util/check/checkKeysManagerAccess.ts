import type { CheckInput } from './types'


const checkKeysManagerAccess = async ({ userAddress, vaultAddress, contracts }: CheckInput) => {
  try {
    const vaultContract = await contracts.helpers.createVault(vaultAddress)
    const keysManager = await vaultContract.keysManager()
    const hasAccess = keysManager.toLowerCase() === userAddress.toLowerCase()

    if (!hasAccess) {
      return Promise.reject('User must be the vault keys manager to perform this action')
    }
  }
  catch {}
}


export default checkKeysManagerAccess
