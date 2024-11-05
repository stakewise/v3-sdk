import lockGas from './lockGas'
import lockEncode from './lockEncode'
import type { Output } from '../../requests/getQueuePosition'


export type ClaimQueueInput = {
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
  position: NonNullable<Output['position']>
}

export interface ClaimQueue {
  (values: ClaimQueueInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof claimQueueGas
  encode: typeof claimQueueEncode
}
