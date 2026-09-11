import type { RedeemerWithdrawInput } from './types'
import { validate } from './validate'


export const commonLogic = (values: RedeemerWithdrawInput) => {
  const { contracts } = values

  const { userAddress, shares } = validate(values)

  const redeemerContract = contracts.base.osTokenRedeemer

  return {
    shares,
    userAddress,
    redeemerContract,
  }
}
