import getVault from '../../requests/getVault'
import { parseArgs } from '../../../../helpers'

import { addSubVaultSchema, type AddSubVaultInput } from './types'


export const commonLogic = async (values: AddSubVaultInput) => {
  parseArgs(addSubVaultSchema, values)

  const { subVaultsRegistry } = await getVault(values)

  return values.contracts.helpers.createSubVaultsRegistry(subVaultsRegistry)
}
