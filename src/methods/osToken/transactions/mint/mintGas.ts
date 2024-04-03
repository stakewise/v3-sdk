import type { MintInput } from './types'
import { commonLogic } from './common'
import { getVaultMulticallGas } from '../../../utils'


const mintGas = (values: MintInput) => {
  const { provider } = values

  const multicallArgs = commonLogic(values)

  return getVaultMulticallGas({ ...multicallArgs, provider })
}


export default mintGas
