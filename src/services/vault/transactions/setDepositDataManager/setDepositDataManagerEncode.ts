import { commonLogic } from './common'
import type { SetDepositDataManagerInput } from './types'
import getVaultVersion from '../../requests/getVaultVersion'


const setDepositDataManagerEncode = async (values: SetDepositDataManagerInput) => {
  const { vaultAddress, managerAddress, contracts } = values

  const { isV1Version } = await getVaultVersion(values)

  if (isV1Version) {
    const vaultContract = contracts.helpers.createVault({ vaultAddress })

    return vaultContract.setKeysManager.populateTransaction(managerAddress)
  }

  const contract = commonLogic(values)

  return contract.setDepositDataManager.populateTransaction(vaultAddress, managerAddress)
}


export default setDepositDataManagerEncode
