import type * as z from 'zod/mini'

import { validateSchema } from './validate'


export type DepositAndMintInput = StakeWise.CommonParams & z.input<typeof validateSchema>

export interface ExtractDepositAndMint {
  (values: StakeWise.ExtractInput<DepositAndMintInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<DepositAndMintInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<DepositAndMintInput>) => Promise<StakeWise.TransactionData>
}
