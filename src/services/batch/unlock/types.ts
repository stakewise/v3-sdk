import type { UnlockInput } from '../../boost/transactions/unlock/types'


export type UnlockBatchInput = UnlockInput

export interface ExtractUnlockBatch {
  (values: StakeWise.ExtractInput<UnlockBatchInput>): Promise<StakeWise.TransactionHash>
  encode: (values: StakeWise.ExtractInput<UnlockBatchInput>) => Promise<StakeWise.BatchData>
}
