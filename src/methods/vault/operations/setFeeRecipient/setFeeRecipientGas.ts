import { commonLogic } from './common'
import { getMulticallGas } from '../../utils'
import type { SetFeeRecipientInput } from './types'


const setFeeRecipientGas = (props: SetFeeRecipientInput) => {
  const { provider } = props

  const multicallArgs = commonLogic(props)

  return getMulticallGas({ ...multicallArgs, provider })
}


export default setFeeRecipientGas
