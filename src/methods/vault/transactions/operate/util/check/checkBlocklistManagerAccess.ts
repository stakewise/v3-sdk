import type { CheckInput } from './types'


const checkBlocklistManagerAccess = async ({ userAddress, vaultAddress, contracts }: CheckInput) => {
  try {
    const vaultContract = await contracts.helpers.createBlocklistedVault(vaultAddress)
    const blocklistManager = await vaultContract.blocklistManager()
    const hasAccess = blocklistManager.toLowerCase() === userAddress.toLowerCase()

    if (!hasAccess) {
      return Promise.reject('User must be the vault blocklist manager to perform this action')
    }
  }
  catch {}
}


export default checkBlocklistManagerAccess
