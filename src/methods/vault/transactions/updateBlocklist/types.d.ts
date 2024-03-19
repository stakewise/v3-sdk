import updateBlocklistGas from './updateBlocklistGas'
import updateBlocklistEncode from './updateBlocklistEncode'


export type UpdateBlocklistInput = {
  blocklist: Array<{
    address: string
    isNew: boolean
  }>
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

export interface UpdateBlocklist {
  (values: UpdateBlocklistInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof updateBlocklistGas
  encode: typeof updateBlocklistEncode
}
