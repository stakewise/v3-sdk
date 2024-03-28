import setValidatorsRootGas from './setValidatorsRootGas'
import setValidatorsRootEncode from './setValidatorsRootEncode'
import type { BaseInput } from '../../utils'


export type SetValidatorsRootParams = {
  validatorsRoot: string
}

export type SetValidatorsRootInput = BaseInput & SetValidatorsRootParams

export interface SetValidatorsRoot {
  (values: SetValidatorsRootInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof setValidatorsRootGas
  encode: typeof setValidatorsRootEncode
}
