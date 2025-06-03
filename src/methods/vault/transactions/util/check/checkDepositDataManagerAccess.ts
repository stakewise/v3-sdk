import { getVaultVersion } from '../../../../../utils'
import type { CheckInput } from './types'


const checkDepositDataManagerAccess = async ({ userAddress, vaultAddress, contracts }: CheckInput) => {
  try {
    const vaultContract = contracts.helpers.createVault({ vaultAddress })
    const { isV1Version } = await getVaultVersion({ vaultAddress, contracts })

    const depositDataManager = isV1Version
      ? await vaultContract.keysManager()
      : await contracts.base.depositDataRegistry.getDepositDataManager(vaultAddress)

    const hasAccess = depositDataManager.toLowerCase() === userAddress.toLowerCase()

    if (!hasAccess) {
      return Promise.reject(`User must be the vault deposit data manager to perform this action`)
    }
  }
  catch (error) {
    return Promise.reject(`Failed to check deposit data manager access: ${error}`)
  }
}


export default checkDepositDataManagerAccess
