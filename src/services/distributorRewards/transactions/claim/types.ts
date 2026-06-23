import type { ClaimArgs } from './validate'


export type ClaimInput = Omit<StakeWise.BaseInput, 'vaultAddress'> & ClaimArgs

export interface ExtractClaim {
  (values: StakeWise.ExtractInput<ClaimInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<ClaimInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<ClaimInput>) => Promise<StakeWise.TransactionData>
}
