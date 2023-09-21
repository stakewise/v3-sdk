import getHealthFactor from '../getHealthFactor'
import getOsTokenPositionShares from './getOsTokenPositionShares'


type GetOsTokenInput = {
  userAddress: string
  vaultAddress: string
  stakedAssets: bigint
  thresholdPercent: bigint
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

const getOsToken = async (values: GetOsTokenInput) => {
  const { options, contracts, vaultAddress, userAddress, stakedAssets, thresholdPercent } = values

  const vaultContract = contracts.helpers.createVaultContract(vaultAddress)

  const gqlShares = await getOsTokenPositionShares({ options, vaultAddress, userAddress })
  const contractShares = await vaultContract.osTokenPositions(userAddress)

  const [ mintedAssets, feePercent ] = await Promise.all([
    contracts.tokens.mintToken.convertToAssets(contractShares),
    contracts.tokens.mintToken.feePercent(),
  ])

  const protocolFeePercent = feePercent / 100n
  const healthFactor = getHealthFactor({ mintedAssets, stakedAssets, thresholdPercent })

  return {
    minted: {
      assets: mintedAssets,
      shares: contractShares,
      fee: contractShares - gqlShares,
    },
    healthFactor,
    protocolFeePercent,
  }
}


export default getOsToken