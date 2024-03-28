import updateWhitelistGas from './updateWhitelistGas'
import updateWhitelistEncode from './updateWhitelistEncode'
import type { BaseInput } from '../../utils'


export type UpdateWhitelistParams = {
  whitelist: Array<{
    address: string
    isNew: boolean
  }>
}

export type UpdateWhitelistInput = BaseInput & UpdateWhitelistParams

export interface UpdateWhitelist {
  (values: UpdateWhitelistInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof updateWhitelistGas
  encode: typeof updateWhitelistEncode
}
