import { commonLogic } from './common'
import type { UpdateStateInput } from './types'


const updateStateEncode = async (values: UpdateStateInput) => {
  const { vaultContract, harvestArgs } = await commonLogic(values)

  if (!harvestArgs) {
    return {}
  }

  return vaultContract.updateState.populateTransaction(harvestArgs)
}


export default updateStateEncode
