import upgradeLeverageStrategyGas from './upgradeLeverageStrategyGas'
import upgradeLeverageStrategyEncode from './upgradeLeverageStrategyEncode'


export type UpgradeLeverageStrategyInput = {
  userAddress: string
  vaultAddress: string
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

export interface UpgradeLeverageStrategy {
  (values: UpgradeLeverageStrategyInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof upgradeLeverageStrategyGas
  encode: typeof upgradeLeverageStrategyEncode
}
