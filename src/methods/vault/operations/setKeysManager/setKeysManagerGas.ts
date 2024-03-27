import { commonLogic } from './common'
import { getMulticallGas } from '../../utils'
import type { SetKeysManagerInput } from './types'


const setKeysManagerGas = (props: SetKeysManagerInput) => {
  const { provider } = props

  const multicallArgs = commonLogic(props)

  return getMulticallGas({ ...multicallArgs, provider })
}


export default setKeysManagerGas
