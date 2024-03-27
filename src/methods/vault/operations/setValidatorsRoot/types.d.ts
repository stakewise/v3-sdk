import setValidatorsRootGas from './setValidatorsRootGas'
import setValidatorsRootEncode from './setValidatorsRootEncode'
import { BaseInput } from '../../utils'


export type SetValidatorsRootInput = BaseInput & {
  validatorsRoot: string
}

export interface SetValidatorsRoot {
  (values: SetValidatorsRootInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof setValidatorsRootGas
  encode: typeof setValidatorsRootEncode
}
