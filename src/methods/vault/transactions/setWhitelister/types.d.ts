import setWhitelisterGas from './setWhitelisterGas'
import setWhitelisterEncode from './setWhitelisterEncode'
import { BaseInput } from '../utils'


export type SetWhitelisterInput = BaseInput & {
  whitelister: string
}

export interface SetWhitelister {
  (values: SetWhitelisterInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof setWhitelisterGas
  encode: typeof setWhitelisterEncode
}
