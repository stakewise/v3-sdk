import type { MintArgs } from './validate'


export type MintInput = StakeWise.CommonParams & MintArgs

export interface ExtractMint {
  (values: StakeWise.ExtractInput<MintInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<MintInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<MintInput>) => Promise<StakeWise.TransactionData>
}
