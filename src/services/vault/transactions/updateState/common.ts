import { getHarvestArgs } from '../../../../contracts/ownMulticalls/util'

import { validate } from './validate'
import type { UpdateStateInput } from './types'


export const commonLogic = async (values: UpdateStateInput) => {
  const { contracts } = values

  const { vaultAddress } = validate(values)

  const harvestArgs = await getHarvestArgs(values)

  const vaultContract = contracts.helpers.createVault({
    vaultAddress,
  })

  return {
    vaultContract,
    harvestArgs,
  }
}
