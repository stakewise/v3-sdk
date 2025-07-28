import type { BaseInput } from '../../../utils'
import setClaimerGas from './setClaimerGas'
import setClaimerEncode from './setClaimerEncode'


export type SetClaimerInput = BaseInput & {
  claimerAddress: string
}

export interface SetClaimer {
  (values: SetClaimerInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof setClaimerGas
  encode: typeof setClaimerEncode
}
