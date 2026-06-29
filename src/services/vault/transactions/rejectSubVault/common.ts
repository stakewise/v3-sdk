import getVault from '../../requests/getVault'
import { parseArgs } from '../../../../helpers'

import { rejectSubVaultSchema, type RejectSubVaultInput } from './types'


export const commonLogic = async (values: RejectSubVaultInput) => {
  parseArgs(rejectSubVaultSchema, values)

  const { subVaultsRegistry } = await getVault(values)

  return values.contracts.helpers.createSubVaultsRegistry(subVaultsRegistry)
}
