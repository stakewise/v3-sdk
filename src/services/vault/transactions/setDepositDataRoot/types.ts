import * as z from 'zod/mini'

import { schema, baseInputSchema } from '../../../../helpers'


export const setDepositDataRootSchema = z.extend(baseInputSchema, {
  depositDataRoot: schema.string,
})

export type SetDepositDataRootInput = StakeWise.CommonParams & z.input<typeof setDepositDataRootSchema>

export interface ExtractSetDepositDataRoot {
  (values: StakeWise.ExtractInput<SetDepositDataRootInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<SetDepositDataRootInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<SetDepositDataRootInput>) => Promise<StakeWise.TransactionData>
}
