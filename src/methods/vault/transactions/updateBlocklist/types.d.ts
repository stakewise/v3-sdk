import { BaseInput } from '../utils'
import updateBlocklistGas from './updateBlocklistGas'
import updateBlocklistEncode from './updateBlocklistEncode'


export type UpdateBlocklistInput =  BaseInput & {
  blocklist: Array<{
    address: string
    isNew: boolean
  }>
}

export interface UpdateBlocklist {
  (values: UpdateBlocklistInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof updateBlocklistGas
  encode: typeof updateBlocklistEncode
}
