import { BaseInput } from '../../../utils'
import claimGas from './claimGas'
import claimEncode from './claimEncode'


export type ClaimInput = Omit<BaseInput, 'vaultAddress'> & {
  proof: string[]
  tokens: string[]
  cumulativeAmounts: string[]
}

export interface ExtractClaim {
  (values: StakeWise.ExtractInput<ClaimInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<ClaimInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<ClaimInput>) => Promise<StakeWise.TransactionData>
}
