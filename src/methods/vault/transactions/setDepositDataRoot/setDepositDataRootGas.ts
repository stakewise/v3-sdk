import { commonLogic } from './common'
import { getGas } from '../../../../utils'
import type { SetDepositDataRootInput } from './types'


const setDepositDataRootGas = async (values: SetDepositDataRootInput) => {
  const contract = commonLogic(values)

  const estimatedGas = await contract.setDepositDataRoot.estimateGas(values.vaultAddress, values.validatorsRoot)

  return getGas({ estimatedGas, provider: values.provider })
}


export default setDepositDataRootGas
