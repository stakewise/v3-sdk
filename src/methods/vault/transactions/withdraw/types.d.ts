import withdrawGas from './withdrawGas'
import withdrawEncode from './withdrawEncode'


export type WithdrawInput = {
  assets: bigint
  userAddress: string
  vaultAddress: string
  availableAssets: bigint
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

export interface Withdraw {
  (values: WithdrawInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof withdrawGas
  encode: typeof withdrawEncode
}
