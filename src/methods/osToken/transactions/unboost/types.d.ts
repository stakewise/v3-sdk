import unboostGas from './unboostGas'
import unboostEncode from './unboostEncode'


export type UnboostInput = {
  percent: number
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

export interface Boost {
  (values: UnboostInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof unboostGas
  encode: typeof unboostEncode
}
