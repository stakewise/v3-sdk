import graphql from '../../../graphql'
import getHealthFactor from '../helpers/getHealthFactor'
import { wrapAbortPromise } from '../../../modules/gql-module'
import { validateArgs, apiUrls, OsTokenPositionHealth, Network, BigDecimal } from '../../../utils'


type GetOsTokenPositionInput = {
  userAddress: string
  vaultAddress: string
  stakedAssets: bigint
  thresholdPercent: bigint
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

type Output = {
  minted: {
    assets: bigint
    shares: bigint
  }
  healthFactor: {
    value: number
    health: OsTokenPositionHealth
  }
  boost: {
    shares: bigint
    percent: number
  }
  protocolFeePercent: bigint
}

const getPosition = async (values: GetOsTokenPositionInput) => {
  const { contracts, options, vaultAddress, userAddress, stakedAssets, thresholdPercent } = values

  validateArgs.address({ vaultAddress, userAddress })
  validateArgs.bigint({ stakedAssets, thresholdPercent })

  const boost = {
    shares: 0n,
    percent: 0,
  }

  const isMainnet = options.network === Network.Mainnet
  const vaultContract = contracts.helpers.createVault({ vaultAddress })
  const mintedShares = await vaultContract.osTokenPositions(userAddress)

  const [ mintedAssets, feePercent ] = await Promise.all([
    contracts.base.mintTokenController.convertToAssets(mintedShares),
    contracts.base.mintTokenController.feePercent(),
  ])

  const protocolFeePercent = feePercent / 100n
  const healthFactor = getHealthFactor({ mintedAssets, stakedAssets, thresholdPercent })

  if (isMainnet) {
    const boostedShares = await graphql.subgraph.osToken.fetchBoostTokenSharesQuery({
      url: apiUrls.getSubgraphqlUrl(options),
      variables: {
        vaultAddress,
        userAddress,
      },
      modifyResult: (data) => BigInt(data.leverageStrategyPositions[0]?.osTokenShares || '0'),
    })

    const percent = new BigDecimal(boostedShares)
      .multiply(100)
      .divide(mintedShares)
      .decimals(2)
      .toString()

    boost.percent = Number(percent)
    boost.shares = boostedShares
  }

  const result: Output = {
    minted: {
      assets: mintedAssets,
      shares: mintedShares,
    },
    boost,
    healthFactor,
    protocolFeePercent,
  }

  return result
}


export default wrapAbortPromise<GetOsTokenPositionInput, Output>(getPosition)
