import mintGas from './mintGas'
import mintEncode from './mintEncode'


export type MintInput = {
  shares: bigint
  userAddress: string
  vaultAddress: string
  referrerAddress?: string
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

export interface Mint {
  (values: MintInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof mintGas
  encode: typeof mintEncode
}
