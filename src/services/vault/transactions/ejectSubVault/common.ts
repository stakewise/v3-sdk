import { EjectSubVaultInput } from './types'
import { validateArgs } from '../../../../helpers'


export const commonLogic = (values: EjectSubVaultInput) => {
  const { vaultAddress, subVaultsRegistryAddress, subVaultAddress, userAddress } = values

  validateArgs.address({ vaultAddress, userAddress, subVaultsRegistryAddress, subVaultAddress })

  return values.contracts.base.subVaultsRegistry(subVaultsRegistryAddress)
}
