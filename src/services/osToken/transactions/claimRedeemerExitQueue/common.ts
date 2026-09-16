import type { ClaimRedeemerExitQueueInput } from './types'
import { validate } from './validate'


export const commonLogic = (values: ClaimRedeemerExitQueueInput) => {
  const { contracts } = values

  const { userAddress, positions } = validate(values)

  const redeemerContract = contracts.base.osTokenRedeemer

  const data = positions.map((position) => (
    redeemerContract.interface.encodeFunctionData('claimExitedAssets', [
      BigInt(position.positionTicket),
      BigInt(position.exitQueueIndex),
    ])
  ))

  return {
    data,
    userAddress,
    redeemerContract,
  }
}
