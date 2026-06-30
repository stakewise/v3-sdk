import * as z from 'zod/mini'
import { isAddress } from 'ethers'

import { schema, parseArgs } from '../../helpers'
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

const validateSchema = z.object({
  vaultAddress: schema.ethAddress,
  skip: z.optional(schema.number),
  limit: z.optional(schema.number),
  search: z.optional(schema.string),
})

export const getListVariables = <T>(input: GetListVariablesInput): T => {
  const { vaultAddress, orderDirection, search, limit, skip, addressIn } = input

  parseArgs(validateSchema, input)

  if (typeof orderDirection !== 'undefined') {
    if (![ 'asc', 'desc' ].includes(orderDirection)) {
      throw new Error(`The "orderDirection" argument must be "asc" or "desc"`)
    }
  }

  if (typeof addressIn !== 'undefined') {
    parseArgs(z.object({ addressIn: schema.array() }), { addressIn })
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
