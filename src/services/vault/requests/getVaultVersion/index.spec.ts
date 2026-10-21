import { describe, expect } from 'vitest'

import { it, vaultAddress } from '../../../../../test'
import { vaultInvalidCase } from '../../../../../test/mocks/invalidCases'

import type { GetVaultVersionInput } from './index'


type Input = StakeWise.ExtractInput<GetVaultVersionInput>

const versionCases = [
  {
    name: 'version 1',
    version: 1n,
    expected: {
      version: 1,
      isV1Version: true,
      isV2Version: false,
      isMoreV1: false,
      isMoreV2: false,
    },
  },
  {
    name: 'version 2',
    version: 2n,
    expected: {
      version: 2,
      isV1Version: false,
      isV2Version: true,
      isMoreV1: true,
      isMoreV2: false,
    },
  },
  {
    name: 'version 3',
    version: 3n,
    expected: {
      version: 3,
      isV1Version: false,
      isV2Version: false,
      isMoreV1: true,
      isMoreV2: true,
    },
  },
]

describe('getVaultVersion', () => {
  it.for(versionCases)('$name', async ({ version, expected }, { sdk, runner, vaultContract }) => {
    runner.on(vaultContract, { version: [ version ] })

    const result = await sdk.vault.getVaultVersion({ vaultAddress })

    expect(result).toEqual(expected)
  })

  it('invalid vault address', async ({ sdk, runner }) => {
    const { input, message } = vaultInvalidCase

    const request = sdk.vault.getVaultVersion(input as Input)

    await expect(request).rejects.toThrow(message)
    expect(runner.calls).toHaveLength(0)
  })
})
