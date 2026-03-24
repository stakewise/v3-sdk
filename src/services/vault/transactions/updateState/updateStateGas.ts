import { commonLogic } from './common'
import { getGas, wrapErrorHandler } from '../../../../helpers'
import type { UpdateStateInput } from './types'


const updateStateGas = async (values: UpdateStateInput) => {
  const { provider, userAddress } = values

  const { vaultContract, harvestArgs } = await commonLogic(values)

  if (!harvestArgs) {
    return 0n
  }

  const signer = await provider.getSigner(userAddress)
  const signedContract = vaultContract.connect(signer)

  const estimatedGas = await wrapErrorHandler(
    signedContract.updateState.estimateGas(harvestArgs),
    'gas'
  )

  return getGas({ estimatedGas, provider: values.provider })
}


export default updateStateGas
