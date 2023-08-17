import { backend } from '../../graphql'
import { validateObject, validateVaultAddress } from '../helpers'

import modifyValidatorsData from './modifyValidatorsData'
import { Output, Variables } from './types'


const fetchValidators = async (variables: Variables) => {
  validateObject(variables)

  const address = validateVaultAddress(variables.address)

  try {
    const data = await backend.vault.fetchVaultValidatorsQuery<Output>({
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
