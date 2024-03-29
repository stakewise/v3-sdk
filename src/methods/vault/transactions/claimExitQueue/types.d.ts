import claimExitQueueGas from './claimExitQueueGas'
import claimExitQueueEncode from './claimExitQueueEncode'
import { BaseInput } from '../../utils'


export type ClaimExitQueueInput = BaseInput & {
  positions: Awaited<ReturnType<StakeWise.VaultMethods['getExitQueuePositions']>>['positions']
}

export interface ClaimExitQueue {
  (values: ClaimExitQueueInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof claimExitQueueGas
  encode: typeof claimExitQueueEncode
}
