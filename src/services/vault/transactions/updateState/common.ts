import { getHarvestArgs } from '../../../../contracts/multicall/util'
import { parseArgs } from '../../../../helpers'

import { updateStateSchema, type UpdateStateInput } from './types'


export const commonLogic = async (values: UpdateStateInput) => {
  const { contracts, vaultAddress } = values

  parseArgs(updateStateSchema, values)

  const harvestArgs = await getHarvestArgs(values)

  const vaultContract = contracts.helpers.createVault({
    vaultAddress,
  })

  return {
    vaultContract,
    harvestArgs,
  }
}
