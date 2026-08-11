import type { EnterExitQueueArgs } from './validate'


export type EnterExitQueueInput = StakeWise.CommonParams & EnterExitQueueArgs

export interface ExtractEnterExitQueue {
  (values: StakeWise.ExtractInput<EnterExitQueueInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<EnterExitQueueInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<EnterExitQueueInput>) => Promise<StakeWise.TransactionData>
}
