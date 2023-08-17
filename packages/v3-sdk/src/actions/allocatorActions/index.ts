import { subgraph } from '../../graphql'
import { validateObject } from '../helpers'

import modifyAllocatorActionsData from './modifyAllocatorActionsData'
import { Output, Variables } from './types'


const fetchAllocatorActions = async (variables: Variables) => {
  validateObject(variables)

  try {
    const data = await subgraph.allocatorActions.fetchAllocatorActionsQuery<Output>({
      variables,
      modifyResult: modifyAllocatorActionsData,
    })

    return data
  }
  catch (error) {
    console.log('Fetch validators failed', error)

    return Promise.reject(error)
  }
}


export default fetchAllocatorActions
