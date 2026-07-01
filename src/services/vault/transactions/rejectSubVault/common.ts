import getVault from '../../requests/getVault'

import { validate } from './validate'
import type { RejectSubVaultInput } from './types'


export const commonLogic = async (values: RejectSubVaultInput) => {
  validate(values)

  const { subVaultsRegistry } = await getVault(values)

  return values.contracts.helpers.createSubVaultsRegistry(subVaultsRegistry)
}
