import { AddSubVaultInput } from './types'
import getVault from '../../requests/getVault'
import { validateArgs } from '../../../../helpers'


export const commonLogic = async (values: AddSubVaultInput) => {
  const { vaultAddress, subVaultAddress, userAddress } = values

  validateArgs.address({ vaultAddress, userAddress, subVaultAddress })

  const { subVaultsRegistry } = await getVault(values)

  return values.contracts.helpers.createSubVaultsRegistry(subVaultsRegistry)
}
