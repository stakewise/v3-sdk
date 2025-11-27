import { UnlockEncodeOutput } from './unlockEncode'


export type UnlockInput = StakeWise.CommonParams & {
  percent: number
  userAddress: string
  vaultAddress: string
  leverageStrategyData?: {
    version: number
    isUpgradeRequired: boolean
  }
}

export interface ExtractUnlock {
  (values: StakeWise.ExtractInput<UnlockInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<UnlockInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<UnlockInput>) => Promise<UnlockEncodeOutput>
}
