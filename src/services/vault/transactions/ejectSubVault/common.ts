import getVault from '../../requests/getVault'
import { parseArgs } from '../../../../helpers'

import { ejectSubVaultSchema, type EjectSubVaultInput } from './types'


export const commonLogic = async (values: EjectSubVaultInput) => {
  parseArgs(ejectSubVaultSchema, values)

  const { subVaultsRegistry } = await getVault(values)

  return values.contracts.helpers.createSubVaultsRegistry(subVaultsRegistry)
}
