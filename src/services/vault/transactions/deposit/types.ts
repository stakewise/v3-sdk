import * as z from 'zod/mini'
import { ZeroAddress } from 'ethers'

import { schema, baseInputSchema } from '../../../../helpers'


export const depositSchema = z.extend(baseInputSchema, {
  assets: schema.bigint,
  referrerAddress: z._default(schema.ethAddress, ZeroAddress),
})

export type DepositInput = StakeWise.CommonParams & z.input<typeof depositSchema>

export interface ExtractDeposit {
  (values: StakeWise.ExtractInput<DepositInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<DepositInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<DepositInput>) => Promise<StakeWise.TransactionData>
}
