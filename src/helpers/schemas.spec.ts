import { describe, expect } from 'vitest'
import * as z from 'zod/mini'

import { it, checksumAddress } from '../../test'
import { baseInputInvalidCases } from '../../test/mocks/invalidCases'

import parseArgs from './parseArgs'
import schema, { baseInputSchema } from './schemas'


const megabyte = 1024 * 1024

const lowerAddress = checksumAddress.toLowerCase()
const wrongChecksum = checksumAddress.replace('d8dA', 'D8dA')

const addressMessage = 'must be a valid address'
const hashMessage = 'must be a valid 32-byte hex hash (0x + 64 hex chars)'

const getImage = (bytes: number) => `data:image/png;base64,${btoa('a'.repeat(bytes))}`

type ValidCase = {
  name: string
  brick: z.ZodMiniType
  value: unknown
  expected?: unknown
}

type InvalidCase = {
  name: string
  brick: z.ZodMiniType
  value: unknown
  message: string
  path?: PropertyKey[]
}

const validCases: ValidCase[] = [
  {
    name: 'string',
    brick: schema.string,
    value: 'text',
  },
  {
    name: 'number',
    brick: schema.number,
    value: 1,
  },
  {
    name: 'boolean',
    brick: schema.boolean,
    value: false,
  },
  {
    name: 'bigint',
    brick: schema.bigint,
    value: 1n,
  },
  {
    name: 'hash',
    brick: schema.hash,
    value: `0x${'ab'.repeat(32)}`,
  },
  {
    name: 'array',
    brick: schema.array(schema.string),
    value: [ 'text' ],
  },
  {
    name: 'maxLength',
    brick: schema.maxLength(3),
    value: 'abc',
  },
  {
    name: 'ethAddressLower output',
    brick: schema.ethAddressLower,
    value: checksumAddress,
    expected: lowerAddress,
  },
  {
    name: 'array default item',
    brick: schema.array(),
    value: [ 1, 'text', {} ],
  },
  {
    name: 'image size limit',
    brick: schema.image,
    value: getImage(megabyte),
  },
  {
    name: 'empty image',
    brick: schema.image,
    value: '',
  },
]

const invalidCases: InvalidCase[] = [
  {
    name: 'string',
    brick: schema.string,
    value: 1,
    message: 'must be a string',
  },
  {
    name: 'number',
    brick: schema.number,
    value: '1',
    message: 'must be a number',
  },
  {
    name: 'boolean',
    brick: schema.boolean,
    value: 0,
    message: 'must be a boolean',
  },
  {
    name: 'bigint',
    brick: schema.bigint,
    value: 1,
    message: 'must be of type bigint',
  },
  {
    name: 'ethAddress',
    brick: schema.ethAddress,
    value: '0x123',
    message: addressMessage,
  },
  {
    name: 'ethAddressLower',
    brick: schema.ethAddressLower,
    value: '0x123',
    message: addressMessage,
  },
  {
    name: 'hash',
    brick: schema.hash,
    value: `0x${'ab'.repeat(31)}`,
    message: hashMessage,
  },
  {
    name: 'array',
    brick: schema.array(schema.string),
    value: [],
    message: 'is an empty array',
  },
  {
    name: 'maxLength',
    brick: schema.maxLength(3),
    value: 'abcd',
    message: 'must be less than 3 characters',
  },
  {
    name: 'ethAddress checksum',
    brick: schema.ethAddress,
    value: wrongChecksum,
    message: addressMessage,
  },
  {
    name: 'array non-array',
    brick: schema.array(),
    value: 'text',
    message: 'must be an array',
  },
  {
    name: 'array item',
    brick: schema.array(schema.string),
    value: [ 'text', 1 ],
    path: [ 1 ],
    message: 'must be a string',
  },
  {
    name: 'image size limit',
    brick: schema.image,
    value: getImage(megabyte + 1),
    message: 'must be under 1 MB, current size is 1.00 MB',
  },
  {
    name: 'image with invalid base64',
    brick: schema.image,
    value: 'data:image/png;base64,%%%',
    message: 'must be a base64 image',
  },
]

describe('schemas', () => {

  it.for(validCases)('$name valid', ({ brick, value, expected = value }) => {
    const result = brick.safeParse(value)

    expect(result).toEqual({ success: true, data: expected })
  })

  it.for(invalidCases)('$name invalid', ({ brick, value, path = [], message }) => {
    const issue = brick.safeParse(value).error?.issues[0]

    expect(issue?.path).toEqual(path)
    expect(issue?.message).toBe(message)
  })

  it.for(baseInputInvalidCases)('baseInputSchema $name', ({ input, message }) => {
    expect(() => parseArgs(baseInputSchema, input)).toThrow(message)
  })
})
