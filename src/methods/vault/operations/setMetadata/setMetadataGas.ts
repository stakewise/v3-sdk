import { commonLogic } from './common'
import { getMulticallGas } from '../../utils'
import type { SetMetadataInput } from './types'


const setMetadataGas = (props: SetMetadataInput) => {
  const { provider } = props

  const multicallArgs = commonLogic(props)

  return getMulticallGas({ ...multicallArgs, provider })
}


export default setMetadataGas
