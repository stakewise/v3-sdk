import { backend } from '../../../graphql'

import validateVaultAddress from './validateVaultAddress'
import modifyValidatorsData from './modifyValidatorsData'


const fetchValidators = async (vaultAddress: string) => {
  const address = validateVaultAddress(vaultAddress)

  try {
    const data = await backend.vault.fetchVaultValidatorsQuery<Vault.Validator[]>({
      variables: { address },
      modifyResult: modifyValidatorsData,
    })

    return data
  }
  catch (error) {
    console.log('Fetch validators failed', error)

    return Promise.reject(error)
  }
}


export default fetchValidators
