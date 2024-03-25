import setBlocklistManagerGas from './setBlocklistManagerGas'
import setBlocklistManagerEncode from './setBlocklistManagerEncode'
import { BaseInput } from '../utils'


export type SetBlocklistManagerInput = BaseInput & {
  blocklistManager: string
}

export interface SetBlocklistManager {
  (values: SetBlocklistManagerInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof setBlocklistManagerGas
  encode: typeof setBlocklistManagerEncode
}
