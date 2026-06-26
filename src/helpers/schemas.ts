import * as z from 'zod/mini'
import { isAddress, isHexString } from 'ethers'


const string = z.string({ error: 'must be a string' })
const number = z.number({ error: 'must be a number' })
const boolean = z.boolean({ error: 'must be a boolean' })
const bigint = z.bigint({ error: 'must be of type bigint' })
const ethAddress = z.string().check(z.refine(isAddress, 'must be a valid address'))
const hash = z.string().check(z.refine((value) => isHexString(value, 32), 'must be a valid 32-byte hex hash (0x + 64 hex chars)'))

const ethAddressLower = ethAddress.check(z.toLowerCase())

export const parseArgs = <Schema extends z.ZodMiniType>(schema: Schema, input: unknown): z.infer<Schema> => {
  const result = schema.safeParse(input)

  if (!result.success) {
    const { path, message } = result.error.issues[0]

    throw new Error(path.length ? `The "${path.join('.')}" argument ${message}` : message)
  }

  return result.data
}

export default {
  hash,
  bigint,
  string,
  number,
  boolean,
  ethAddress,
  ethAddressLower,
}
