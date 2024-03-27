import { commonLogic } from './common'
import { getMulticallGas } from '../../utils'
import type { SetBlocklistManagerInput } from './types'


const setBlocklistManagerGas = (props: SetBlocklistManagerInput) => {
  const { provider } = props

  const multicallArgs = commonLogic(props)

  return getMulticallGas({ ...multicallArgs, provider })
}


export default setBlocklistManagerGas
