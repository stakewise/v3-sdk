import { apiUrls } from 'helpers'
import { backend } from 'graphql'
import { VaultValidatorsQueryVariables } from 'graphql/backend/vault'


type GetVaultValidatorsInput = {
  options: SDK.Options
  vaultAddress: VaultValidatorsQueryVariables['address']
}

const getVaultValidators = async (input: GetVaultValidatorsInput) => {
  const { options, vaultAddress } = input

  const data = await backend.vault.fetchVaultValidatorsQuery({
    url: apiUrls.getBackendUrl(options),
    variables: { address: vaultAddress.toLowerCase() },
  })

  return data?.vaults?.[0]?.validators || []
}


export default getVaultValidators
