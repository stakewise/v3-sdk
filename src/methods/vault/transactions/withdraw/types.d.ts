import withdrawGas from './withdrawGas'
import withdrawEncode from './withdrawEncode'


export type WithdrawInput = {
  assets: bigint
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

export interface Withdraw {
  (values: WithdrawInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof withdrawGas
  encode: typeof withdrawEncode
}
