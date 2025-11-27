import { BigDecimal, constants } from '../../../../helpers'
import { wrapAbortPromise } from '../../../../modules/gql-module'


const getOsTokenRate = async (input: StakeWise.CommonParams) => {
  const { contracts } = input

  const mintTokenRate = await contracts.base.priceOracle.latestAnswer()

  return new BigDecimal(mintTokenRate)
    .divide(constants.blockchain.amount1)
    .toString()
}


export default wrapAbortPromise<StakeWise.CommonParams, string>(getOsTokenRate)
