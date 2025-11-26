import { isAddress } from 'ethers'
import { validateArgs } from '../../utils'
import { StakeWiseSubgraphGraph } from '../../types/graphql/subgraph'


export type GetListVariablesInput = {
  vaultAddress: string
  orderDirection?: StakeWiseSubgraphGraph.OrderDirection
  search?: string
  limit?: number
  skip?: number
  addressIn?: string[]
}

const validateList = (addressIn: string[]) => {
  const isValid = addressIn.every((address) => isAddress(address))

  if (!isValid) {
    throw new Error('The "addressIn" argument must be an array of valid addresses')
  }
}

export const getListVariables = <T>(input: GetListVariablesInput): T => {
  const { vaultAddress, orderDirection, search, limit, skip, addressIn } = input

  validateArgs.address({ vaultAddress })

  if (typeof skip !== 'undefined') {
    validateArgs.number({ skip })
  }

  if (typeof limit !== 'undefined') {
    validateArgs.number({ limit })
  }

  if (typeof search !== 'undefined') {
    validateArgs.string({ search })
  }

  if (typeof orderDirection !== 'undefined') {
    if (![ 'asc', 'desc' ].includes(orderDirection)) {
      throw new Error(`The "orderDirection" argument must be "asc" or "desc"`)
    }
  }

  if (typeof addressIn !== 'undefined') {
    validateArgs.array({ addressIn })
    validateList(addressIn as string[])
  }

  const vault = vaultAddress.toLowerCase()

  const where = search
    ? { vault, address_in: addressIn, address_contains: search.toLowerCase() }
    : { vault, address_in: addressIn }

  return {
    where,
    skip: skip || 0,
    limit: limit || 100,
    orderDirection: orderDirection || 'desc',
  } as T
}
