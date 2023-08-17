import { backend } from '../../graphql'
import { validateAddress } from '../helpers'

import modifyValidatorsData from './modifyValidatorsData'
import { Output, Variables } from './types'


const fetchValidators = async (variables: Variables) => {
  validateAddress(variables.address)

  try {
    const data = await backend.vault.fetchVaultValidatorsQuery<Output>({
      variables: {
        address: variables.address.toLowerCase(),
      },
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
