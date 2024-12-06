import getHealthFactor from '../../helpers/getHealthFactor'
import { wrapAbortPromise } from '../../../../modules/gql-module'
import { validateArgs } from '../../../../utils'


type GetOsTokenPositionInput = {
  userAddress: string
  vaultAddress: string
  stakedAssets: bigint
  liqThresholdPercent: bigint
  contracts: StakeWise.Contracts
}

type Output = {
  minted: {
    assets: bigint
    shares: bigint
  }
  healthFactor: ReturnType<typeof getHealthFactor>
  protocolFeePercent: bigint
}

const getPosition = async (values: GetOsTokenPositionInput) => {
  const { contracts, vaultAddress, userAddress, stakedAssets, liqThresholdPercent } = values

  validateArgs.address({ vaultAddress, userAddress })
  validateArgs.bigint({ stakedAssets, liqThresholdPercent })

  const vaultContract = contracts.helpers.createVault({ vaultAddress })
  const mintedShares = await vaultContract.osTokenPositions(userAddress)

  const [ mintedAssets, feePercent ] = await Promise.all([
    contracts.base.mintTokenController.convertToAssets(mintedShares),
    contracts.base.mintTokenController.feePercent(),
  ])

  const protocolFeePercent = feePercent / 100n
  const healthFactor = getHealthFactor({ mintedAssets, stakedAssets, liqThresholdPercent })

  const result: Output = {
    minted: {
      assets: mintedAssets,
      shares: mintedShares,
    },
    healthFactor,
    protocolFeePercent,
  }

  return result
}


export default wrapAbortPromise<GetOsTokenPositionInput, Output>(getPosition)
