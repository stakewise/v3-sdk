import type { CheckInput } from './types'


const checkAdminAccess = async ({ userAddress, vaultAddress, contracts }: CheckInput) => {
  try {
    const vaultContract = await contracts.helpers.createVault({ vaultAddress })
    const admin = await vaultContract.admin()
    const hasAccess = admin.toLowerCase() === userAddress.toLowerCase()

    if (!hasAccess) {
      return Promise.reject('User must be the vault admin to perform this action')
    }
  }
  catch {}
}


export default checkAdminAccess
