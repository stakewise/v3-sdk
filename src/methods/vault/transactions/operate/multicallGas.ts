import { commonLogic } from './common'
import { getMulticallGas } from '../../utils'
import type { MulticallInput } from './types'


const multicallGas = (props: MulticallInput) => {
  const { provider } = props

  const multicallArgs = commonLogic(props)

  return getMulticallGas({ ...multicallArgs, provider })
}


export default multicallGas
