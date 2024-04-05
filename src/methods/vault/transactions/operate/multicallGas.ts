import { commonLogic } from './common'
import { getVaultMulticallGas } from '../../../utils'
import type { MulticallInput } from './types'


const multicallGas = async (props: MulticallInput) => {
  const { provider } = props

  const multicallArgs = await commonLogic(props)

  return getVaultMulticallGas({ ...multicallArgs, provider })
}


export default multicallGas
