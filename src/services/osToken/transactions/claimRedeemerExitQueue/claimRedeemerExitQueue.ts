import { commonLogic } from './common'
import type { ClaimRedeemerExitQueueInput } from './types'
import { sendWithGasMargin } from '../../../../helpers'


const claimRedeemerExitQueue = async (values: ClaimRedeemerExitQueueInput) => {
  const { provider } = values

  const { redeemerContract, userAddress, data } = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = redeemerContract.connect(signer)

  const result = await sendWithGasMargin(signedContract.multicall, [ data ])

  return result.hash
}


export default claimRedeemerExitQueue
