import * as z from 'zod/mini'

import { schema, baseInputSchema } from '../../../../helpers'


export const setDepositDataManagerSchema = z.extend(baseInputSchema, {
  managerAddress: schema.ethAddress,
})

export type SetDepositDataManagerInput = StakeWise.CommonParams & z.input<typeof setDepositDataManagerSchema>

export interface ExtractSetDepositDataManager {
  (values: StakeWise.ExtractInput<SetDepositDataManagerInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<SetDepositDataManagerInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<SetDepositDataManagerInput>) => Promise<StakeWise.TransactionData>
}
