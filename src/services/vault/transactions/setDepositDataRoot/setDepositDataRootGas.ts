import { commonLogic } from './common'
import type { SetDepositDataRootInput } from './types'
import getVaultVersion from '../../requests/getVaultVersion'
import { getGas, wrapErrorHandler } from '../../../../helpers'


const setDepositDataRootGas = async (values: SetDepositDataRootInput) => {
  const { provider, userAddress, vaultAddress, depositDataRoot, contracts } = values

  const signer = await provider.getSigner(userAddress)

  const { isV1Version } = await getVaultVersion(values)

  if (isV1Version) {
    const vaultContract = contracts.helpers.createVault({ vaultAddress })
    const signedContract = vaultContract.connect(signer)

    const estimatedGas = await wrapErrorHandler(
      signedContract.setValidatorsRoot.estimateGas(depositDataRoot),
      'gas'
    )

    return getGas({ estimatedGas, provider })
  }

  const contract = commonLogic(values)
  const signedContract = contract.connect(signer)

  const estimatedGas = await wrapErrorHandler(
    signedContract.setDepositDataRoot.estimateGas(vaultAddress, depositDataRoot),
    'gas'
  )

  return getGas({ estimatedGas, provider })
}


export default setDepositDataRootGas
