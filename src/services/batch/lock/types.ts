import type { LockInput } from '../../boost/transactions/lock/types'


export type LockBatchInput = Omit<LockInput, 'approveParams' | 'permitParams'>

export interface ExtractLockBatch {
  (values: StakeWise.ExtractInput<LockBatchInput>): Promise<StakeWise.TransactionHash>
  encode: (values: StakeWise.ExtractInput<LockBatchInput>) => Promise<StakeWise.BatchData>
}
