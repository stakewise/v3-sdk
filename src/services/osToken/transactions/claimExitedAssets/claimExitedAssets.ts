import { commonLogic } from './common'
import type { ClaimExitedAssetsInput } from './types'
import { wrapErrorHandler } from '../../../../helpers'


const claimExitedAssets = async (values: ClaimExitedAssetsInput) => {
  const { provider } = values

  const { redeemerContract, userAddress, positionTicket, exitQueueIndex } = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = redeemerContract.connect(signer)

  const result = await wrapErrorHandler(
    signedContract.claimExitedAssets(positionTicket, exitQueueIndex),
    'transaction'
  )

  return result.hash
}


export default claimExitedAssets
