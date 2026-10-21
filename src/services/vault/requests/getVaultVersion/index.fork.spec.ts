import { describe, expect } from 'vitest'

import { it } from '../../../../../test'
import { useForkSdk, mainnetAccounts } from '../../../../../test/fork'


const { v1VaultAddress } = mainnetAccounts

const v2VaultAddress = '0x579ECfE4270Ce23589D8b0A41DD234316018c11C'
const v3VaultAddress = '0xB266274F55e784689e97b7E363B0666d92e6305B'

const versionCases = [
  {
    name: 'v1 vault',
    vaultAddress: v1VaultAddress,
    flags: {
      isMoreV1: false,
      isMoreV2: false,
      isV1Version: true,
      isV2Version: false,
    },
  },
  {
    name: 'v2 vault',
    vaultAddress: v2VaultAddress,
    flags: {
      isMoreV1: true,
      isMoreV2: false,
      isV1Version: false,
      isV2Version: true,
    },
  },
  {
    name: 'v3 vault',
    vaultAddress: v3VaultAddress,
    flags: {
      isMoreV1: true,
      isMoreV2: true,
      isV1Version: false,
      isV2Version: false,
    },
  },
]

describe('getVaultVersion', () => {
  const { sdk } = useForkSdk()

  it.for(versionCases)('$name', async ({ vaultAddress, flags }) => {
    const vaultVersion = await sdk.vault.getVaultVersion({ vaultAddress })

    const version = await sdk.contracts.helpers.createVault({ vaultAddress }).version()

    expect(vaultVersion).toEqual({ ...flags, version: Number(version) })
  })
})
