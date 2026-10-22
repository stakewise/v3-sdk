import { commonLogic } from './common'
import { sendWithGasMargin } from '../../../../helpers'
import type { UpdateStateInput } from './types'


const updateState = async (values: UpdateStateInput) => {
  const { provider, userAddress } = values

  const { vaultContract, harvestArgs } = await commonLogic(values)

  const signer = await provider.getSigner(userAddress)

  const signedContract = vaultContract.connect(signer)

  if (!harvestArgs) {
    return ''
  }

  const response = await sendWithGasMargin(signedContract.updateState, [ harvestArgs ])

  return response.hash
}


export default updateState
