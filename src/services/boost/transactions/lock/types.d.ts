import { LockEncodeOutput } from './lockEncode'


type PermitParams = {
  vault: string
  amount: bigint
  deadline: number
  v: number
  r: string
  s: string
}

export type LockInput = StakeWise.CommonParams & {
  amount: bigint
  userAddress: string
  vaultAddress: string
  leverageStrategyData?: {
    version: number
    isUpgradeRequired: boolean
  }
  referrerAddress?: string
  permitParams?: PermitParams
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
