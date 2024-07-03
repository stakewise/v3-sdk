import { BigDecimal, constants } from '../../../utils'
import { wrapAbortPromise } from '../../../modules/gql-module'


export type GetOsTokenRateInput = {
  contracts: StakeWise.Contracts
}

type Output = string

const getOsTokenRate = async (input: GetOsTokenRateInput) => {
  const { contracts } = input

  const mintTokenRate = await contracts.base.priceOracle.latestAnswer()

  return new BigDecimal(mintTokenRate)
    .divide(constants.blockchain.amount1)
    .toString()
}


export default wrapAbortPromise<GetOsTokenRateInput, Output>(getOsTokenRate)
