import type { RedeemerWithdrawArgs } from './validate'


export type RedeemerWithdrawInput = StakeWise.CommonParams & RedeemerWithdrawArgs

export interface ExtractRedeemerWithdraw {
  (values: StakeWise.ExtractInput<RedeemerWithdrawInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<RedeemerWithdrawInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<RedeemerWithdrawInput>) => Promise<StakeWise.TransactionData>
}
