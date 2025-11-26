import { UnlockEncodeOutput } from './unlockEncode'


export type UnlockInput = {
  percent: number
  userAddress: string
  vaultAddress: string
  leverageStrategyData?: {
    version: number
    isUpgradeRequired: boolean
  }
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

export interface ExtractUnlock {
  (values: StakeWise.ExtractInput<UnlockInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<UnlockInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<UnlockInput>) => Promise<UnlockEncodeOutput>
}
