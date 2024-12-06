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
  (values: DepositInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof mintGas
  encode: typeof mintEncode
}
