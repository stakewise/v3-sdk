import * as z from 'zod/mini'

import { schema } from '../../../../helpers'


export const setDepositDataRootSchema = z.object({
  userAddress: schema.ethAddress,
  vaultAddress: schema.ethAddress,
  depositDataRoot: schema.string,
})

export type SetDepositDataRootInput = StakeWise.CommonParams & z.input<typeof setDepositDataRootSchema>

export interface ExtractSetDepositDataRoot {
  (values: StakeWise.ExtractInput<SetDepositDataRootInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<SetDepositDataRootInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<SetDepositDataRootInput>) => Promise<StakeWise.TransactionData>
}
