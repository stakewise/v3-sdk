import type { BaseInput } from '../../utils'
import updateBlocklistGas from './updateBlocklistGas'
import updateBlocklistEncode from './updateBlocklistEncode'


export type UpdateBlocklistParams = {
  blocklist: Array<{
    address: string
    isNew: boolean
  }>
}

export type UpdateBlocklistInput = BaseInput & UpdateBlocklistParams

export interface UpdateBlocklist {
  (values: UpdateBlocklistInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof updateBlocklistGas
  encode: typeof updateBlocklistEncode
}
