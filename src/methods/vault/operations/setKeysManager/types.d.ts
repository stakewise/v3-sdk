import setKeysManagerGas from './setKeysManagerGas'
import setKeysManagerEncode from './setKeysManagerEncode'
import { BaseInput } from '../../utils'


export type SetKeysManagerInput = BaseInput & {
  keysManager: string
}

export interface SetKeysManager {
  (values: SetKeysManagerInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof setKeysManagerGas
  encode: typeof setKeysManagerEncode
}
