import { commonLogic } from './common'
import type { RedeemerWithdrawInput } from './types'
import { sendWithGasMargin } from '../../../../helpers'


const redeemerWithdraw = async (values: RedeemerWithdrawInput) => {
  const { provider } = values

  const { redeemerContract, userAddress, shares } = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = redeemerContract.connect(signer)

  const result = await sendWithGasMargin(signedContract.enterExitQueue, [ shares, userAddress ])

  return result.hash
}


export default redeemerWithdraw
