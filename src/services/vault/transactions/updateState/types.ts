import * as z from 'zod/mini'

import { schema } from '../../../../helpers'


export const updateStateSchema = z.object({
  userAddress: schema.ethAddress,
  vaultAddress: schema.ethAddress,
})

export type UpdateStateInput = StakeWise.CommonParams & z.input<typeof updateStateSchema>

export interface ExtractUpdateStateInput {
  (values: StakeWise.ExtractInput<UpdateStateInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<UpdateStateInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<UpdateStateInput>) => Promise<Partial<StakeWise.TransactionData>>
}
