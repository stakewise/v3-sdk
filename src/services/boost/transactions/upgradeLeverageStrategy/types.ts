export type UpgradeLeverageStrategyInput = StakeWise.BaseInput

export interface ExtractUpgradeLeverageStrategy {
  (values: StakeWise.ExtractInput<UpgradeLeverageStrategyInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<UpgradeLeverageStrategyInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<UpgradeLeverageStrategyInput>) => Promise<StakeWise.TransactionData>
}
