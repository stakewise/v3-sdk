import updateWhitelistGas from './updateWhitelistGas'
import updateWhitelistEncode from './updateWhitelistEncode'


export type UpdateWhitelistInput = {
  whitelist: Array<{
    address: string
    isNew: boolean
  }>
  vaultAddress: string
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

export interface UpdateWhitelist {
  (values: UpdateWhitelistInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof updateWhitelistGas
  encode: typeof updateWhitelistEncode
}
