import type { CheckInput } from './types'


const checkDepositDataManagerAccess = async ({ userAddress, vaultAddress, contracts }: CheckInput) => {
  try {
    const vaultContract = await contracts.helpers.createVault(vaultAddress)
    const version = await vaultContract.version()

    const depositDataManager = version === 1n
      ? await vaultContract.keysManager()
      : await contracts.base.depositDataRegistry.getDepositDataManager(vaultAddress)

    const hasAccess = depositDataManager.toLowerCase() === userAddress.toLowerCase()

    if (!hasAccess) {
      return Promise.reject(`User must be the vault deposit data manager to perform this action`)
    }
  }
  catch {}
}


export default checkDepositDataManagerAccess
