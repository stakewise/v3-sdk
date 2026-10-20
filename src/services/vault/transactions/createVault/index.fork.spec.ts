import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import { forkAbis, useForkSdk, parseEvents, extendContract } from '../../../../../test/fork'
import { it, userAddress, decodeCalls } from '../../../../../test'

import { configs, Network, VaultType } from '../../../../helpers'

import type StakeWiseSDK from '../../../../StakeWiseSDK'


type FactoryName = keyof StakeWise.Contracts['factories']

type VaultToken = {
  name: string
  symbol: string
}

type CreateCase = {
  name: string
  type: VaultType
  factory: FactoryName
  curator?: string
  vaultToken?: VaultToken
}

type ReadVaultInput = {
  sdk: StakeWiseSDK
  vaultAddress: string
  isErc20: boolean
  isMetaVault: boolean
}

type CreatedVault = {
  admin: string
  capacity: bigint
  feePercent: bigint
  curator?: string
  vaultToken?: VaultToken
}

const capacity = parseEther('1000')
const keysManagerFee = 5.55
const feePercent = 555n
const erc20Token = { name: 'Fork vault token', symbol: 'FVT' }
const mainnetCurator = configs[Network.Mainnet].addresses.base.curator.v2

const createCases: CreateCase[] = [
  { name: 'vault', type: VaultType.Default, factory: 'vault' },
  {
    name: 'erc20 vault',
    type: VaultType.Default,
    factory: 'erc20Vault',
    vaultToken: erc20Token,
  },
  { name: 'private vault', type: VaultType.Private, factory: 'privateVault' },
  {
    name: 'erc20 private vault',
    type: VaultType.Private,
    factory: 'erc20PrivateVault',
    vaultToken: erc20Token,
  },
  { name: 'blocklist vault', type: VaultType.Blocklist, factory: 'blocklistVault' },
  {
    name: 'erc20 blocklist vault',
    type: VaultType.Blocklist,
    factory: 'erc20BlocklistVault',
    vaultToken: erc20Token,
  },
  {
    name: 'meta vault',
    type: VaultType.MetaVault,
    factory: 'metavault',
    curator: mainnetCurator,
  },
  {
    name: 'erc20 meta vault',
    type: VaultType.MetaVault,
    factory: 'erc20Metavault',
    curator: mainnetCurator,
    vaultToken: erc20Token,
  },
  {
    name: 'private meta vault',
    type: VaultType.PrivateMetaVault,
    factory: 'privateMetavault',
    curator: mainnetCurator,
  },
  {
    name: 'erc20 private meta vault',
    type: VaultType.PrivateMetaVault,
    factory: 'erc20PrivateMetavault',
    curator: mainnetCurator,
    vaultToken: erc20Token,
  },
]

const readVault = async (values: ReadVaultInput) => {
  const { sdk, vaultAddress, isErc20, isMetaVault } = values

  const createdVaultContract = extendContract(sdk.contracts.helpers.createVault({ vaultAddress }), forkAbis.vault)

  const [ admin, vaultCapacity, vaultFeePercent ] = await Promise.all([
    createdVaultContract.admin(),
    createdVaultContract.capacity(),
    createdVaultContract.feePercent(),
  ])

  const result: CreatedVault = { admin, capacity: vaultCapacity, feePercent: vaultFeePercent }

  if (isErc20) {
    const [ name, symbol ] = await Promise.all([
      createdVaultContract.name(),
      createdVaultContract.symbol(),
    ])

    result.vaultToken = { name, symbol }
  }

  if (isMetaVault) {
    const registryAddress = await createdVaultContract.subVaultsRegistry()
    const subVaultsRegistryContract = sdk.contracts.helpers.createSubVaultsRegistry(registryAddress)

    result.curator = await subVaultsRegistryContract.subVaultsCurator()
  }

  return result
}

describe('createVault', () => {
  const { sdk, provider } = useForkSdk()

  it.for(createCases)('$name', async ({ type, factory, curator, vaultToken }) => {
    const input = {
      type,
      capacity,
      vaultToken,
      userAddress,
      keysManagerFee,
    }

    const factoryContract = extendContract(sdk.contracts.factories[factory], forkAbis.vaultFactory)
    const factoryAddress = await factoryContract.getAddress()

    const [ encoded, gas ] = await Promise.all([
      sdk.vault.create.encode(input),
      sdk.vault.create.estimateGas(input),
    ])

    const hash = await sdk.vault.create(input)

    const [ receipt, sentTx ] = await Promise.all([
      provider.waitForTransaction(hash),
      provider.getTransaction(hash),
    ])

    const createdEvents = await parseEvents(factoryContract, receipt)
    const [ vaultCreated ] = createdEvents

    expect(createdEvents).toHaveLength(1)

    const created = await readVault({
      sdk,
      vaultAddress: vaultCreated?.args.vault,
      isErc20: Boolean(vaultToken),
      isMetaVault: Boolean(curator),
    })

    const [ call ] = decodeCalls(factoryContract, encoded.data)

    expect(call.name).toBe('createVault')
    expect(encoded.to).toBe(factoryAddress)
    expect(gas).toBeGreaterThan(0n)
    expect(sentTx?.data).toBe(encoded.data)
    expect(receipt?.status).toBe(1)
    expect(created).toEqual({
      admin: userAddress,
      capacity,
      feePercent,
      curator,
      vaultToken,
    })
  })
})
