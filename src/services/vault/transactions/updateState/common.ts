import { getHarvestArgs } from '../../../../contracts/multicall/util'
import { validateArgs } from '../../../../helpers'
import { UpdateStateInput } from './types'


export const commonLogic = async (values: UpdateStateInput) => {
  const { contracts, vaultAddress, userAddress } = values

  validateArgs.address({ vaultAddress, userAddress })

  const harvestArgs = await getHarvestArgs(values)

  const vaultContract = contracts.helpers.createVault({
    vaultAddress,
  })

  return {
    vaultContract,
    harvestArgs,
  }
}
