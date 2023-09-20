import { backend } from 'graphql'
import { VaultValidatorsQueryVariables } from 'graphql/backend/vault'


type GetVaultValidatorsInput = {
  options: SDK.Options
  vaultAddress: VaultValidatorsQueryVariables['address']
}

const getVaultValidators = async (input: GetVaultValidatorsInput) => {
  const { options, vaultAddress } = input

  const data = await backend.vault.fetchVaultValidatorsQuery({
    variables: { address: vaultAddress.toLowerCase() },
    network: options.network,
  })

  return data?.vaults?.[0]?.validators || []
}


export default getVaultValidators
