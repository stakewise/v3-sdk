import type { BaseInput } from '../../../utils'
import setClaimerGas from './setClaimerGas'
import setClaimerEncode from './setClaimerEncode'


export type SetClaimerInput = Omit<BaseInput, 'vaultAddress'> & {
  claimerAddress: string
  rewardSplitterAddress: string
}

export interface SetClaimer {
  (values: SetClaimerInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof setClaimerGas
  encode: typeof setClaimerEncode
}
