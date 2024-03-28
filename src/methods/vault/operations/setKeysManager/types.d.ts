import setKeysManagerGas from './setKeysManagerGas'
import setKeysManagerEncode from './setKeysManagerEncode'
import type { BaseInput } from '../../utils'


export type SetKeysManagerParams = {
  keysManager: string
}

export type SetKeysManagerInput = BaseInput & SetKeysManagerParams

export interface SetKeysManager {
  (values: SetKeysManagerInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof setKeysManagerGas
  encode: typeof setKeysManagerEncode
}
