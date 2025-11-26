import type { CheckInput } from './types'


const checkBlocklistManagerAccess = async ({ userAddress, vaultAddress, contracts }: CheckInput) => {
  try {
    const vaultContract = contracts.helpers.createVault({
      options: { isBlocklist: true },
      vaultAddress,
    })

    const blocklistManager = await vaultContract.blocklistManager()
    const hasAccess = blocklistManager.toLowerCase() === userAddress.toLowerCase()

    if (!hasAccess) {
      return Promise.reject('User must be the vault blocklist manager to perform this action')
    }
  }
  catch (error) {
    return Promise.reject(`Failed to check blocklist manager access: ${error}`)
  }
}


export default checkBlocklistManagerAccess
