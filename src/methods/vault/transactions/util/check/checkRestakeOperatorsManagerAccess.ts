import type { CheckInput } from './types'


const checkRestakeOperatorsManagerAccess = async ({ userAddress, vaultAddress, contracts }: CheckInput) => {
  try {
    const vaultContract = await contracts.helpers.createVault(vaultAddress)
    const restakeOperatorsManager = await vaultContract.restakeOperatorsManager()
    const hasAccess = restakeOperatorsManager.toLowerCase() === userAddress.toLowerCase()

    if (!hasAccess) {
      return Promise.reject('User must be the restake operators manager to perform this action')
    }
  }
  catch {}
}


export default checkRestakeOperatorsManagerAccess
