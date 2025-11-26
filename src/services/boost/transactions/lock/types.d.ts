import { LockEncodeOutput } from './lockEncode'


type PermitParams = {
  vault: string
  amount: bigint
  deadline: number
  v: number
  r: string
  s: string
}

export type LockInput = {
  amount: bigint
  userAddress: string
  vaultAddress: string
  leverageStrategyData?: {
    version: number
    isUpgradeRequired: boolean
  }
  referrerAddress?: string
  permitParams?: PermitParams
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
  leverageStrategyData?: {
    version: number
    isUpgradeRequired: boolean
  }
}

export interface ExtractLock {
  (values: StakeWise.ExtractInput<LockInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<LockInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<LockInput>) => Promise<LockEncodeOutput>
}
