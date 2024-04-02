import { commonLogic } from './common'
import { getVaultMulticallGas } from '../../../utils'
import type { MulticallInput } from './types'


const multicallGas = (props: MulticallInput) => {
  const { provider } = props

  const multicallArgs = commonLogic(props)

  return getVaultMulticallGas({ ...multicallArgs, provider })
}


export default multicallGas
