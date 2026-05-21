import { commonLogic } from './common'
import type { SetDepositDataRootInput } from './types'
import getVaultVersion from '../../requests/getVaultVersion'


const setDepositDataRootEncode = async (values: SetDepositDataRootInput) => {
  const { vaultAddress, depositDataRoot, contracts } = values

  const { isV1Version } = await getVaultVersion(values)

  if (isV1Version) {
    const vaultContract = contracts.helpers.createVault({ vaultAddress })

    return vaultContract.setValidatorsRoot.populateTransaction(depositDataRoot)
  }

  const contract = commonLogic(values)

  return contract.setDepositDataRoot.populateTransaction(vaultAddress, depositDataRoot)
}


export default setDepositDataRootEncode
