import boostGas from './boostGas'
import burnEncode from './burnEncode'


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
  boostAddress: string
  permitParams?: PermitParams
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

export interface Boost {
  (values: BoostInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof boostGas
  encode: typeof burnEncode
}
