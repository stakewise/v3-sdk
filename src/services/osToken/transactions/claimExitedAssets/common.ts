import type { ClaimExitedAssetsInput } from './types'
import { validate } from './validate'


export const commonLogic = (values: ClaimExitedAssetsInput) => {
  const { contracts } = values

  const { userAddress, positionTicket, exitQueueIndex } = validate(values)

  const redeemerContract = contracts.base.osTokenRedeemer

  return {
    userAddress,
    positionTicket,
    exitQueueIndex,
    redeemerContract,
  }
}
