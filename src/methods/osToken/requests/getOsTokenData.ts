import { ZeroAddress } from 'ethers'
import { BigDecimal, Network, constants } from '../../../utils'
import { wrapAbortPromise } from '../../../modules/gql-module'


export type GetOsTokenDataInput = {
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

type MainnetConfig = [ bigint, bigint, bigint, bigint, bigint ]
type NetworksConfig = [ bigint, bigint, bigint ]

export type OsTokenDataMulticallReturnType = {
  mintTokenRate: bigint
  config: MainnetConfig | NetworksConfig
}

type Output = {
  rate: string
  ltvPercent: bigint
  thresholdPercent: bigint
}

const getOsTokenData = async (input: GetOsTokenDataInput) => {
  const { options, contracts } = input

  const isMainnet = options.network === Network.Mainnet
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
      args: isMainnet ? [] : [ ZeroAddress ],
    },
  ])

  const { mintTokenRate, config } = await multicall()

  let ltvPercent = 0n
  let thresholdPercent = 0n

  // On mainnet getConfig returns
  // [ redeemFromLtvPercent, redeemToLtvPercent, thresholdPercent, liqBonusPercent, ltvPercent ]
  if (isMainnet) {
    ltvPercent = (config as MainnetConfig)[4]
    thresholdPercent = config[2]
  }
  else {
    // On other networks getConfig returns [ bonusPercent, thresholdPercent, ltvPercent ]
    ltvPercent = config[2]
    thresholdPercent = config[1]
  }

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
