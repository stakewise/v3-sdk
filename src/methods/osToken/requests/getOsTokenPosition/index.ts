import { validateArgs } from '../../../../utils'
import getHealthFactor from '../../helpers/getHealthFactor'
import getOsTokenPositionShares from './getOsTokenPositionShares'


type GetOsTokenPositionInput = {
  userAddress: string
  vaultAddress: string
  stakedAssets: bigint
  thresholdPercent: bigint
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

const getOsTokenPosition = (values: GetOsTokenPositionInput) => {
  const { options, contracts, vaultAddress, userAddress, stakedAssets, thresholdPercent } = values

  validateArgs.address({ vaultAddress, userAddress })
  validateArgs.bigint({ stakedAssets, thresholdPercent })

  return getOsTokenPositionShares({ options, vaultAddress, userAddress })
    .then(async (gqlMintedShares) => {
      const vaultContract = contracts.helpers.createVault(vaultAddress)
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
          fee: mintedShares - gqlMintedShares,
        },
        healthFactor,
        protocolFeePercent,
      }
    })
}

export default getOsTokenPosition
