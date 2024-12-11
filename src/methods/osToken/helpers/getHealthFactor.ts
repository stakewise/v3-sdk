import { OsTokenPositionHealth, BigDecimal, validateArgs, constants } from '../../../utils'


type GetHealthFactorInput = {
  mintedAssets: bigint
  stakedAssets: bigint
  thresholdPercent: bigint
}

const getHealthFactor = (values: GetHealthFactorInput) => {
  const { mintedAssets, stakedAssets, thresholdPercent } = values

  validateArgs.bigint({ mintedAssets, stakedAssets, thresholdPercent })

  if (mintedAssets === 0n || stakedAssets === 0n) {
    return {
      value: 0,
      health: OsTokenPositionHealth.Healthy,
    }
  }

  const healthFactor = Number(
    new BigDecimal(stakedAssets)
      .multiply(thresholdPercent)
      .divide(constants.blockchain.amount1)
      .divide(mintedAssets)
      .decimals(4)
      .toString()
  )

  const result = {
    value: healthFactor,
    health: OsTokenPositionHealth.Unhealthy,
  }

  // If healthFactor = 1, then position is Healthy, but we need to add
  // a small gap to notify the user in advance of problems with the position
  if (healthFactor >= 1.02) {
    result.health = OsTokenPositionHealth.Healthy
  }
  else if (healthFactor >= 1.01) {
    result.health = OsTokenPositionHealth.Moderate
  }
  else if (healthFactor >= 1.00) {
    result.health = OsTokenPositionHealth.Risky
  }
  else {
    result.health = OsTokenPositionHealth.Unhealthy
  }

  return result
}


export default getHealthFactor
