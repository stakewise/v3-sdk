import { userAddress, vaultAddress } from '../constants'

import { baseInputWiringCase } from './invalidCases'


const invalidAssetsMessage = 'The "assets" argument must be of type bigint'

export const getDepositInvalidCases = (input: Record<string, unknown> = {}) => {
  const baseInput = { userAddress, vaultAddress, ...input }

  return [
    baseInputWiringCase,
    {
      name: 'missing assets',
      input: baseInput,
      message: invalidAssetsMessage,
    },
    {
      name: 'string assets',
      input: { ...baseInput, assets: '10' },
      message: invalidAssetsMessage,
    },
    {
      name: 'invalid referrer address',
      input: { ...baseInput, assets: 10n, referrerAddress: '0x123' },
      message: 'The "referrerAddress" argument must be a valid address',
    },
  ]
}
