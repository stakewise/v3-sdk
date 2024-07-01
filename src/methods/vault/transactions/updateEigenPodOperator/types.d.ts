import type { BaseInput } from '../../../utils'
import updateEigenPodOperatorGas from './updateEigenPodOperatorGas'
import updateEigenPodOperatorEncode from './updateEigenPodOperatorEncode'


export type UpdateEigenPodOperatorInput = BaseInput & {
  ownerAddress: string
  operatorAddress: string
}

export interface UpdateEigenPodOperator {
  (values: UpdateEigenPodOperatorInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof updateEigenPodOperatorGas
  encode: typeof updateEigenPodOperatorEncode
}
