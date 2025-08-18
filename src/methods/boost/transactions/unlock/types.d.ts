import unlockGas from './unlockGas'
import unlockEncode from './unlockEncode'


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

export interface Unlock {
  (values: UnlockInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof unlockGas
  encode: typeof unlockEncode
}
