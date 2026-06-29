import * as z from 'zod/mini'

import { schema } from '../../../../helpers'


export const upgradeLeverageStrategySchema = z.object({
  userAddress: schema.ethAddress,
  vaultAddress: schema.ethAddress,
})

export type UpgradeLeverageStrategyInput = StakeWise.CommonParams & z.input<typeof upgradeLeverageStrategySchema>

export interface ExtractUpgradeLeverageStrategy {
  (values: StakeWise.ExtractInput<UpgradeLeverageStrategyInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<UpgradeLeverageStrategyInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<UpgradeLeverageStrategyInput>) => Promise<StakeWise.TransactionData>
}
