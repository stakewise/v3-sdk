import setEigenPodOperatorGas from './setEigenPodOperatorGas'
import setEigenPodOperatorEncode from './setEigenPodOperatorEncode'
import { BaseInput } from '../../../utils'


export type SetEigenPodOperatorInput = BaseInput & {
  ownerAddress: string
  operatorAddress: string
}

export interface SetEigenPodOperator {
  (values: SetEigenPodOperatorInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof setEigenPodOperatorGas
  encode: typeof setEigenPodOperatorEncode
}
