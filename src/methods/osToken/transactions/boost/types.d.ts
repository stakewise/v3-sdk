import boostGas from './boostGas'
import boostEncode from './boostEncode'


type PermitParams = {
  vault: string
  amount: bigint
  deadline: number
  v: number
  r: string
  s: string
}

export type BoostInput = {
  amount: bigint
  userAddress: string
  vaultAddress: string
  strategyProxy: string
  permitParams?: PermitParams
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

export interface Boost {
  (values: BoostInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof boostGas
  encode: typeof boostEncode
}
