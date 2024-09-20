import getShares from './getShares'
import getHealthFactor from '../../helpers/getHealthFactor'
import { wrapAbortPromise } from '../../../../modules/gql-module'
import { validateArgs, OsTokenPositionHealth } from '../../../../utils'


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
    fee: bigint
  }
  healthFactor: {
    value: number
    health: OsTokenPositionHealth
  }
  protocolFeePercent: bigint
}

const getOsTokenPosition = async (values: GetOsTokenPositionInput) => {
  const { options, contracts, vaultAddress, userAddress, stakedAssets, thresholdPercent } = values

  validateArgs.address({ vaultAddress, userAddress })
  validateArgs.bigint({ stakedAssets, thresholdPercent })

  const gqlMintedShares = await getShares({ options, vaultAddress, userAddress })

  const vaultContract = contracts.helpers.createVault({ vaultAddress })
  const mintedShares = await vaultContract.osTokenPositions(userAddress)

  const [ mintedAssets, feePercent ] = await Promise.all([
    contracts.base.mintTokenController.convertToAssets(mintedShares),
    contracts.base.mintTokenController.feePercent(),
  ])

  const protocolFeePercent = feePercent / 100n
  const healthFactor = getHealthFactor({ mintedAssets, stakedAssets, thresholdPercent })

  const result: Output = {
    minted: {
      assets: mintedAssets,
      shares: mintedShares,
      fee: mintedShares - gqlMintedShares,
    },
    healthFactor,
    protocolFeePercent,
  }

  return result
}


export default wrapAbortPromise<GetOsTokenPositionInput, Output>(getOsTokenPosition)
