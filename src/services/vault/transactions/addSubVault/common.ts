import getVault from '../../requests/getVault'

import { validate } from './validate'
import type { AddSubVaultInput } from './types'


export const commonLogic = async (values: AddSubVaultInput) => {
  validate(values)

  const { subVaultsRegistry } = await getVault(values)

  return values.contracts.helpers.createSubVaultsRegistry(subVaultsRegistry)
}
