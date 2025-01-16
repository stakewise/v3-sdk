import burnGas from './burnGas'
import burnEncode from './burnEncode'


export type BurnInput = {
  shares: bigint
  userAddress: string
  vaultAddress: string
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

export interface Burn {
  (values: BurnInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof burnGas
  encode: typeof burnEncode
}
