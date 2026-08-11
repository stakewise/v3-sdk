import type * as z from 'zod/mini'

import { OsTokenPositionHealth, BigDecimal, constants } from '../../../../helpers'

import { validate, validateSchema } from './validate'


export type GetHealthFactorInput = z.input<typeof validateSchema>

const getHealthFactor = (values: GetHealthFactorInput) => {
  const { mintedAssets, stakedAssets, liqThresholdPercent } = validate(values)

  if (mintedAssets === 0n || stakedAssets === 0n) {
    return {
      value: 0,
      health: OsTokenPositionHealth.Healthy,
    }
  }

  const healthFactor = Number(
    new BigDecimal(stakedAssets)
      .multiply(liqThresholdPercent)
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
