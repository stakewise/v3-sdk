import { subgraph } from '../../graphql'
import { validateObject, validateVaultAddress } from '../helpers'

import modifyVaultData from './modifyVaultData'
import { Variables, Output } from './types'


const fetchVault = async (variables: Variables) => {
  validateObject(variables)

  const address = validateVaultAddress(variables.address)

  try {
    const data = await subgraph.vault.fetchVaultQuery<Output>({
      variables: { address },
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
