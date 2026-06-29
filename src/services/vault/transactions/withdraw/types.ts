import * as z from 'zod/mini'

import { schema } from '../../../../helpers'


export const withdrawSchema = z.object({
  assets: schema.bigint,
  userAddress: schema.ethAddress,
  vaultAddress: schema.ethAddress,
})

export type WithdrawInput = StakeWise.CommonParams & z.input<typeof withdrawSchema>

export interface ExtractWithdraw {
  (values: StakeWise.ExtractInput<WithdrawInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<WithdrawInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<WithdrawInput>) => Promise<StakeWise.TransactionData>
}
