import upgradeLeverageStrategyGas from './upgradeLeverageStrategyGas'
import upgradeLeverageStrategyEncode from './upgradeLeverageStrategyEncode'


export type UpgradeLeverageStrategyInput = {
  userAddress: string
  vaultAddress: string
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

export interface ExtractUpgradeLeverageStrategy {
  (values: StakeWise.ExtractInput<UpgradeLeverageStrategyInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<UpgradeLeverageStrategyInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<UpgradeLeverageStrategyInput>) => Promise<StakeWise.TransactionData>
}
