import { validateArgs } from 'helpers'

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

const getOsTokenPosition = async (values: GetOsTokenPositionInput) => {
  const { options, contracts, vaultAddress, userAddress, stakedAssets, thresholdPercent } = values

  validateArgs.address({ vaultAddress, userAddress })
  validateArgs.bigint({ stakedAssets, thresholdPercent })

  const vaultContract = contracts.helpers.createVaultContract(vaultAddress)

  const gqlMintedShares = await getOsTokenPositionShares({ options, vaultAddress, userAddress })
  const mintedShares = await vaultContract.osTokenPositions(userAddress)

  const [ mintedAssets, feePercent ] = await Promise.all([
    contracts.tokens.mintToken.convertToAssets(mintedShares),
    contracts.tokens.mintToken.feePercent(),
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
}


export default getOsTokenPosition
