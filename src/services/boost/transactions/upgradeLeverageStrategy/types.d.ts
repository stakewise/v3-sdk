import upgradeLeverageStrategyGas from './upgradeLeverageStrategyGas'
import upgradeLeverageStrategyEncode from './upgradeLeverageStrategyEncode'


export type UpgradeLeverageStrategyInput = StakeWise.CommonParams & {
  userAddress: string
  vaultAddress: string
}

export interface ExtractUpgradeLeverageStrategy {
  (values: StakeWise.ExtractInput<UpgradeLeverageStrategyInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<UpgradeLeverageStrategyInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<UpgradeLeverageStrategyInput>) => Promise<StakeWise.TransactionData>
}
