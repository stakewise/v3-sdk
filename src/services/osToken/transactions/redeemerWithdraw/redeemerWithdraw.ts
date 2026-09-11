import { commonLogic } from './common'
import type { RedeemerWithdrawInput } from './types'
import { wrapErrorHandler } from '../../../../helpers'


const redeemerWithdraw = async (values: RedeemerWithdrawInput) => {
  const { provider } = values

  const { redeemerContract, userAddress, shares } = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = redeemerContract.connect(signer)

  const result = await wrapErrorHandler(
    signedContract.enterExitQueue(shares, userAddress),
    'transaction'
  )

  return result.hash
}


export default redeemerWithdraw
