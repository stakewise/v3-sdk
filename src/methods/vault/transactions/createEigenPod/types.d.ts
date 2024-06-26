import createEigenPodGas from './createEigenPodGas'
import createEigenPodEncode from './createEigenPodEncode'
import { BaseInput } from '../../../utils'


export type CreateEigenPodInput = BaseInput

export interface CreateEigenPod {
  (values: CreateEigenPodInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof createEigenPodGas
  encode: typeof createEigenPodEncode
}
