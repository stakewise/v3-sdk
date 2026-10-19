import { userAddress, vaultAddress } from '../constants'


const invalidVaultAddress = {
  name: 'invalid vault address',
  input: { vaultAddress: '0x123', userAddress },
  message: 'The "vaultAddress" argument must be a valid address',
}

const invalidUserAddress = {
  name: 'invalid user address',
  input: { vaultAddress, userAddress: '0x123' },
  message: 'The "userAddress" argument must be a valid address',
}

const missingVaultAddress = {
  name: 'missing vault address',
  input: { userAddress },
  message: 'The "vaultAddress" argument',
}

const missingUserAddress = {
  name: 'missing user address',
  input: { vaultAddress },
  message: 'The "userAddress" argument',
}

export const baseInputInvalidCases = [
  invalidVaultAddress,
  invalidUserAddress,
  missingVaultAddress,
  missingUserAddress,
]

export const baseInputWiringCase = invalidVaultAddress

export const vaultInvalidCase = {
  name: 'invalid vault address',
  input: { vaultAddress: '0x123' },
  message: 'The "vaultAddress" argument must be a valid address',
}

export const userInvalidCase = {
  name: 'invalid user address',
  input: { userAddress: '0x123' },
  message: 'The "userAddress" argument must be a valid address',
}

export const getDaysCountInvalidCase = (input: Record<string, unknown>) => ({
  name: 'invalid days count',
  input: { ...input, daysCount: '30' },
  message: 'The "daysCount" argument must be a number',
})

const pagedInput = { vaultAddress, skip: 0, limit: 10 }

export const pagedInvalidCases = [
  {
    name: 'invalid vault address',
    input: { ...pagedInput, vaultAddress: '0x123' },
    message: 'The "vaultAddress" argument must be a valid address',
  },
  {
    name: 'invalid skip',
    input: { ...pagedInput, skip: '0' },
    message: 'The "skip" argument must be a number',
  },
  {
    name: 'invalid limit',
    input: { ...pagedInput, limit: '10' },
    message: 'The "limit" argument must be a number',
  },
]
