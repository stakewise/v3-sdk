import upgradeLeverageStrategy from './upgradeLeverageStrategy'
import upgradeLeverageStrategyGas from './upgradeLeverageStrategyGas'
import upgradeLeverageStrategyEncode from './upgradeLeverageStrategyEncode'
import type { UpgradeLeverageStrategyInput, ExtractUpgradeLeverageStrategy } from './types'


export const createUpgradeLeverageStrategy = (params: StakeWise.CommonParams): ExtractUpgradeLeverageStrategy  => {
  const result = (values: StakeWise.ExtractInput<UpgradeLeverageStrategyInput>) => upgradeLeverageStrategy({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<UpgradeLeverageStrategyInput>) => upgradeLeverageStrategyEncode({ ...params, ...values })
  // eslint-disable-next-line max-len
  result.estimateGas = (values: StakeWise.ExtractInput<UpgradeLeverageStrategyInput>) => upgradeLeverageStrategyGas({ ...params, ...values })

  return result
}

export type { ExtractUpgradeLeverageStrategy } from './types'
