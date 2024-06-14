import { ZeroAddress } from 'ethers'
import { constants, BigDecimal } from '../../../utils'
import { wrapAbortPromise } from '../../../modules/gql-module'


export type GetOsTokenDataInput = {
  contracts: StakeWise.Contracts
}

export type OsTokenDataMulticallReturnType = {
  mintTokenRate: bigint
  config: [ bigint, bigint, bigint ]
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
      returnName: 'config',
      methodName: 'getConfig',
      contract: contracts.base.mintTokenConfig ,
      noContractValue: constants.blockchain.amount0,
      args: [ ZeroAddress ],
    },
  ])

  const { mintTokenRate, config } = await multicall()
  const [ bonusPercent, thresholdPercent, ltvPercent ] = config

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
