import { describe, expect } from 'vitest'
import * as z from 'zod/mini'

import { it, checksumAddress } from '../../test'

import parseArgs from './parseArgs'
import schema from './schemas'


type ErrorCase = {
  name: string
  brick: z.ZodMiniType
  input: unknown
  message: string
}

const objectSchema = z.object({
  amount: schema.bigint,
  name: schema.string,
  nested: z.object({ address: schema.ethAddress }),
})

const valid = {
  amount: 1n,
  name: 'vault',
  nested: { address: checksumAddress },
}

const errorCases: ErrorCase[] = [
  {
    name: 'nested path',
    brick: objectSchema,
    input: { ...valid, nested: { address: '0x123' } },
    message: 'The "nested.address" argument must be a valid address',
  },
  {
    name: 'root value',
    brick: schema.string,
    input: 1,
    message: 'must be a string',
  },
  {
    name: 'first issue',
    brick: objectSchema,
    input: { ...valid, amount: 1, name: 2 },
    message: 'The "amount" argument must be of type bigint',
  },
]

describe('parseArgs', () => {

  it('unknown keys', () => {
    const result = parseArgs(objectSchema, { ...valid, extra: 1 })

    expect(result).toEqual(valid)
  })

  it.for(errorCases)('$name', ({ brick, input, message }) => {
    const parse = () => parseArgs(brick, input)

    expect(parse).toThrow(new Error(message))
  })
})
