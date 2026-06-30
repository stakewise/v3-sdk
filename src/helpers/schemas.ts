import * as z from 'zod/mini'
import { isAddress, isHexString } from 'ethers'


const string = z.string({ error: 'must be a string' })
const number = z.number({ error: 'must be a number' })
const boolean = z.boolean({ error: 'must be a boolean' })
const bigint = z.bigint({ error: 'must be of type bigint' })
const hash = z.string().check(z.refine((value) => isHexString(value, 32), 'must be a valid 32-byte hex hash (0x + 64 hex chars)'))

const ethAddress = z.string().check(z.refine(isAddress, 'must be a valid address'))
const ethAddressLower = ethAddress.check(z.toLowerCase())

export const baseInputSchema = z.object({
  userAddress: ethAddress,
  vaultAddress: ethAddress,
})

const array = (withEmptyCheck: boolean = true) => {
  const brick = z.array(z.unknown(), { error: 'must be an array' })

  return withEmptyCheck
    ? brick.check(z.minLength(1, { error: 'is an empty array' }))
    : brick
}

const maxLength = (length: number) => string.check(z.maxLength(length, { error: `must be less than ${length} characters` }))

const imageSizeMb = (value: string) => {
  const decoded = value.substring(value.indexOf(',') + 1)

  return decoded ? atob(decoded).length / 1000 / 1000 : 0
}

const image = string.check(z.refine(
  (value) => imageSizeMb(value) <= 1,
  { error: (issue) => `must be under 1 MB, current size is ${imageSizeMb(issue.input as string).toFixed(2)} MB` }
))

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
  image,
  bigint,
  string,
  number,
  boolean,
  ethAddress,
  ethAddressLower,
  array,
  maxLength,
}
