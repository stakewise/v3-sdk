import depositGas from './depositGas'
import depositEncode from './depositEncode'


export type DepositInput = {
  assets: bigint
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

export interface Deposit {
  (values: DepositInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof depositGas
  encode: typeof depositEncode
}
