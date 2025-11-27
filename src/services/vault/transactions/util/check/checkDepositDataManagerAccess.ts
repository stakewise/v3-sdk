import getVaultVersion from '../../../requests/getVaultVersion'
import type { CheckInput } from './types'


const checkDepositDataManagerAccess = async (values: CheckInput) => {
  const { userAddress, vaultAddress, contracts } = values

  try {
    const vaultContract = contracts.helpers.createVault({ vaultAddress })
    const { isV1Version } = await getVaultVersion(values)

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
