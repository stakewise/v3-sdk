import { subgraph } from '../../graphql'
import { validateAddress } from '../helpers'

import modifyVaultData from './modifyVaultData'
import { Variables, Output } from './types'


const fetchVault = async (variables: Variables) => {
  validateAddress(variables.address)

  try {
    const data = await subgraph.vault.fetchVaultQuery<Output>({
      variables: {
        address: variables.address.toLowerCase(),
      },
      modifyResult: modifyVaultData,
    })

    return data
  }
  catch (error) {
    console.log('Fetch vault failed', error)

    return Promise.reject(error)
  }
}


export default fetchVault
