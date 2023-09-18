import { Network } from 'helpers'
import { backend } from 'graphql'
import { VaultValidatorsQueryVariables } from 'graphql/backend/vault'


type VaultValidatorsInput = {
  network: Network
  address: VaultValidatorsQueryVariables['address']
}

const vaultValidators = async (input: VaultValidatorsInput) => {
  const { network, address } = input

  const data = await backend.vault.fetchVaultValidatorsQuery({
    variables: { address: address.toLowerCase() },
    network,
  })

  return data?.vaults?.[0]?.validators || []
}


export default vaultValidators
