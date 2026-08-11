import type { BurnArgs } from './validate'


export type BurnInput = StakeWise.CommonParams & BurnArgs

export interface ExtractBurn {
  (values: StakeWise.ExtractInput<BurnInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<BurnInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<BurnInput>) => Promise<StakeWise.TransactionData>
}
