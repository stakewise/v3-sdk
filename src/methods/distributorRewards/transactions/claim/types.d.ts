import { BaseInput } from '../../../utils'
import claimGas from './claimGas'
import claimEncode from './claimEncode'


export type ClaimInput = Omit<BaseInput, 'vaultAddress'> & {
  proof: string[]
  tokens: string[]
  cumulativeAmounts: string[]
}

export interface Claim {
  (values: ClaimInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof claimGas
  encode: typeof claimEncode
}
