import { backend } from 'graphql'
import { VaultValidatorsQueryVariables } from 'graphql/backend/vault'


type VaultValidatorsInput = {
  options: SDK.Options
  vaultAddress: VaultValidatorsQueryVariables['address']
}

const vaultValidators = async (input: VaultValidatorsInput) => {
  const { options, vaultAddress } = input

  const data = await backend.vault.fetchVaultValidatorsQuery({
    variables: { address: vaultAddress.toLowerCase() },
    network: options.network,
  })

  return data?.vaults?.[0]?.validators || []
}


export default vaultValidators
