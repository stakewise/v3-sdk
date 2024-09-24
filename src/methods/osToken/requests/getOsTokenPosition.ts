import { validateArgs } from '../../../utils'
import getHealthFactor from '../helpers/getHealthFactor'
import { wrapAbortPromise } from '../../../modules/gql-module'


type Output = {
  minted: {
    assets: bigint
    shares: bigint
  },
  healthFactor: ReturnType<typeof getHealthFactor>
  protocolFeePercent: bigint
}

type GetOsTokenPositionInput = {
  userAddress: string
  vaultAddress: string
  stakedAssets: bigint
  thresholdPercent: bigint
  contracts: StakeWise.Contracts
}

const getOsTokenPosition = async (values: GetOsTokenPositionInput) => {
  const { contracts, vaultAddress, userAddress, stakedAssets, thresholdPercent } = values

  validateArgs.address({ vaultAddress, userAddress })
  validateArgs.bigint({ stakedAssets, thresholdPercent })

  const vaultContract = contracts.helpers.createVault({ vaultAddress })
  const mintedShares = await vaultContract.osTokenPositions(userAddress)

  const [ mintedAssets, feePercent ] = await Promise.all([
    contracts.base.mintTokenController.convertToAssets(mintedShares),
    contracts.base.mintTokenController.feePercent(),
  ])

  const protocolFeePercent = feePercent / 100n
  const healthFactor = getHealthFactor({ mintedAssets, stakedAssets, thresholdPercent })

  return {
    minted: {
      assets: mintedAssets,
      shares: mintedShares,
    },
    healthFactor,
    protocolFeePercent,
  }
}


export default wrapAbortPromise<GetOsTokenPositionInput, Output>(getOsTokenPosition)
