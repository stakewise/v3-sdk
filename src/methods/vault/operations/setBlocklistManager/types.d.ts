import setBlocklistManagerGas from './setBlocklistManagerGas'
import setBlocklistManagerEncode from './setBlocklistManagerEncode'
import type { BaseInput } from '../../utils'


export type SetBlocklistManagerParams = {
  blocklistManager: string
}

export type SetBlocklistManagerInput = BaseInput & SetBlocklistManagerParams

export interface SetBlocklistManager {
  (values: SetBlocklistManagerInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof setBlocklistManagerGas
  encode: typeof setBlocklistManagerEncode
}
