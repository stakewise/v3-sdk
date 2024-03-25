import { SetWhitelister } from './types'
import { commonLogic } from './common'
import setWhitelisterGas from './setWhitelisterGas'
import setWhitelisterEncode from './setWhitelisterEncode'
import { vaultMulticall } from '../../../../contracts'


const setWhitelister: SetWhitelister = async (values) => {
  const multicallCommonArgs = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallCommonArgs)

  return result.hash
}

setWhitelister.encode = setWhitelisterEncode
setWhitelister.estimateGas = setWhitelisterGas


export default setWhitelister
