import getVault from '../../requests/getVault'

import { validate } from './validate'
import type { EjectSubVaultInput } from './types'


export const commonLogic = async (values: EjectSubVaultInput) => {
  validate(values)

  const { subVaultsRegistry } = await getVault(values)

  return values.contracts.helpers.createSubVaultsRegistry(subVaultsRegistry)
}
