import { commonLogic } from './common'
import type { SetDepositDataManagerInput } from './types'
import getVaultVersion from '../../requests/getVaultVersion'
import { getGas, wrapErrorHandler } from '../../../../helpers'


const setDepositDataManagerGas = async (values: SetDepositDataManagerInput) => {
  const { provider, userAddress, vaultAddress, managerAddress, contracts } = values

  const signer = await provider.getSigner(userAddress)

  const { isV1Version } = await getVaultVersion(values)

  if (isV1Version) {
    const vaultContract = contracts.helpers.createVault({ vaultAddress })
    const signedContract = vaultContract.connect(signer)

    const estimatedGas = await wrapErrorHandler(
      signedContract.setKeysManager.estimateGas(managerAddress),
      'gas'
    )

    return getGas({ estimatedGas, provider })
  }

  const contract = commonLogic(values)
  const signedContract = contract.connect(signer)

  const estimatedGas = await wrapErrorHandler(
    signedContract.setDepositDataManager.estimateGas(vaultAddress, managerAddress),
    'gas'
  )

  return getGas({ estimatedGas, provider })
}


export default setDepositDataManagerGas
