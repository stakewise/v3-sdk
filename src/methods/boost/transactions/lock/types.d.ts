import lockGas from './lockGas'
import lockEncode from './lockEncode'


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
  permitParams?: PermitParams
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

export interface Lock {
  (values: LockInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof lockGas
  encode: typeof lockEncode
}
