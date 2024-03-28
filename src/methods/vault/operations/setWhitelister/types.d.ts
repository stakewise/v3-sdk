import setWhitelisterGas from './setWhitelisterGas'
import setWhitelisterEncode from './setWhitelisterEncode'
import type { BaseInput } from '../../utils'


export type SetWhitelisterParams = {
  whitelister: string
}

export type SetWhitelisterInput = BaseInput & SetWhitelisterParams

export interface SetWhitelister {
  (values: SetWhitelisterInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof setWhitelisterGas
  encode: typeof setWhitelisterEncode
}
