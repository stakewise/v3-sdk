import { commonLogic } from './common'
import { getGas } from '../../../../utils'
import type { SetDepositDataManagerInput } from './types'


const setDepositDataManagerGas = async (values: SetDepositDataManagerInput) => {
  const contract = commonLogic(values)

  const estimatedGas = await contract.setDepositDataManager.estimateGas(values.vaultAddress, values.managerAddress)

  return getGas({ estimatedGas, provider: values.provider })
}


export default setDepositDataManagerGas
