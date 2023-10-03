import { constants, BigDecimal } from 'helpers'


export type GetOsTokenDataInput = {
  contracts: StakeWise.Contracts
}

export type OsTokenDataMulticallReturnType = {
  ltvPercent: bigint
  mintTokenRate: bigint
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


export default getOsTokenData
