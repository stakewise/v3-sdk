import * as z from 'zod/mini'

import { schema } from '../../../../helpers'


export const setDepositDataManagerSchema = z.object({
  userAddress: schema.ethAddress,
  vaultAddress: schema.ethAddress,
  managerAddress: schema.ethAddress,
})

export type SetDepositDataManagerInput = StakeWise.CommonParams & z.input<typeof setDepositDataManagerSchema>

export interface ExtractSetDepositDataManager {
  (values: StakeWise.ExtractInput<SetDepositDataManagerInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<SetDepositDataManagerInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<SetDepositDataManagerInput>) => Promise<StakeWise.TransactionData>
}
