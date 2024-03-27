import updateWhitelistGas from './updateWhitelistGas'
import updateWhitelistEncode from './updateWhitelistEncode'
import type { BaseInput } from '../../utils'


export type UpdateWhitelistInput = BaseInput & {
  whitelist: Array<{
    address: string
    isNew: boolean
  }>
}

export interface UpdateWhitelist {
  (values: UpdateWhitelistInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof updateWhitelistGas
  encode: typeof updateWhitelistEncode
}
