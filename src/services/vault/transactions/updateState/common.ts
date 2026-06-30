import { getHarvestArgs } from '../../../../contracts/multicall/util'
import { parseArgs, baseInputSchema } from '../../../../helpers'

import type { UpdateStateInput } from './types'


export const commonLogic = async (values: UpdateStateInput) => {
  const { contracts, vaultAddress } = values

  parseArgs(baseInputSchema, values)

  const harvestArgs = await getHarvestArgs(values)

  const vaultContract = contracts.helpers.createVault({
    vaultAddress,
  })

  return {
    vaultContract,
    harvestArgs,
  }
}
