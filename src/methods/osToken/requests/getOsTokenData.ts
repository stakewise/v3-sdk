import { constants, BigDecimal } from '../../../utils'
import { wrapAbortPromise } from '../../../modules/gql-module'


export type GetOsTokenDataInput = {
  contracts: StakeWise.Contracts
}

export type OsTokenDataMulticallReturnType = {
  ltvPercent: bigint
  mintTokenRate: bigint
  thresholdPercent: bigint
}

type Output = {
  rate: string
  ltvPercent: bigint
  thresholdPercent: bigint
}

const getOsTokenData = async (input: GetOsTokenDataInput) => {
  const { contracts } = input

  const multicall = contracts.helpers.createMulticall<OsTokenDataMulticallReturnType>([
    {
      returnName: 'mintTokenRate',
      methodName: 'latestAnswer',
      contract: contracts.base.priceOracle,
      noContractValue: constants.blockchain.amount0,
      args: [],
    },
    {
      returnName: 'ltvPercent',
      methodName: 'ltvPercent',
      contract: contracts.base.mintTokenConfig ,
      noContractValue: constants.blockchain.amount0,
      args: [],
    },
    {
      returnName: 'thresholdPercent',
      methodName: 'liqThresholdPercent',
      contract: contracts.base.mintTokenConfig,
      noContractValue: constants.blockchain.amount0,
      args: [],
    },
  ])

  const { mintTokenRate, ltvPercent, thresholdPercent } = await multicall()

  const rate = new BigDecimal(mintTokenRate)
    .divide(constants.blockchain.amount1)
    .toString()

  return {
    rate,
    ltvPercent,
    thresholdPercent,
  }
}


export default wrapAbortPromise<GetOsTokenDataInput, Output>(getOsTokenData)
