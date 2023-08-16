import { fetchVault, fetchValidators, validateVaultAddress } from './util'


const fetch = async (vaultAddress: string): Promise<Vault.Data> => {
  const address = validateVaultAddress(vaultAddress)

  const [ vault, validators ] = await Promise.all([
    fetchVault(address),
    fetchValidators(address),
  ])

  return {
    ...vault,
    validators,
  }
}


export {
  fetch,
  fetchVault,
  fetchValidators,
}
