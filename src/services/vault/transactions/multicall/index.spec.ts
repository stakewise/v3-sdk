import { describe, expect } from 'vitest'
import { ZeroAddress } from 'ethers'

import {
  userAddress,
  it as baseIt,
  vaultAddress,
  setFeePercent,
  spenderAddress,
  setFeeRecipient,
} from '../../../../../test'
import vaultQuery from '../../../../../test/mocks/vaultQuery'

import type { VaultQueryPayload } from '../../../../graphql/subgraph/vault'
import type { MulticallRequestInput } from '../../../../contracts/ownMulticalls/types'


type MockMulticallInput = {
  version?: number
  isPrivate?: boolean
  isBlocklist?: boolean
}

const baseInput = { userAddress, vaultAddress }
const params = [ setFeeRecipient, setFeePercent ]
const names = [ 'setFeeRecipient', 'setFeePercent' ]
const positionCall = { method: 'osTokenPositions', args: [ userAddress ] }
const lowercaseVariables = { address: vaultAddress.toLowerCase() }

const abiCases = [
  {
    name: 'private vault',
    values: { isPrivate: true },
    call: { method: 'updateWhitelist', args: [ spenderAddress, true ] },
  },
  {
    name: 'blocklist vault',
    values: { isBlocklist: true },
    call: { method: 'updateBlocklist', args: [ spenderAddress, true ] },
  },
  {
    name: 'vault v3',
    values: { version: 3 },
    call: { method: 'depositAndMintOsToken', args: [ userAddress, 6n, ZeroAddress ] },
  },
]

const missingCases = [
  {
    name: 'not private vault',
    values: { isBlocklist: true, version: 3 },
    method: 'updateWhitelist',
  },
  {
    name: 'not blocklist vault',
    values: { isPrivate: true, version: 3 },
    method: 'updateBlocklist',
  },
  {
    name: 'vault v2',
    values: { isPrivate: true, isBlocklist: true },
    method: 'depositAndMintOsToken',
  },
]

const it = baseIt.extend('mockMulticall', ({ sdk, runner, graphql }) => (
  (values: MockMulticallInput = {}) => {
    const { version = 2, isPrivate = false, isBlocklist = false } = values
    const vaultContract = sdk.contracts.helpers.createVault({
      vaultAddress,
      options: { isPrivate: true, isBlocklist: true, isDepositWithMint: true },
    })
    const vault = {
      ...vaultQuery.vault,
      isPrivate,
      isBlocklist,
      version: String(version),
    }

    runner.on(vaultContract, {
      setFeePercent: [],
      setFeeRecipient: [],
      osTokenPositions: [ 6n ],
    })

    graphql.mock<VaultQueryPayload>({ name: 'Vault', data: { vault } })
    graphql.mockHarvestParams({ canHarvest: false })

    const run = (request: MulticallRequestInput) => sdk.vault.multicall({ ...baseInput, request })

    return { run, contract: vaultContract }
  }
))

describe('multicall', () => {
  it('encode', async ({ graphql, multicall, mockMulticall }) => {
    const vaultCall = mockMulticall()

    const calls = await multicall.checkTransactionData({ ...vaultCall, params, names })
    const callArgs = calls.map(({ args }) => args.toArray())

    expect(callArgs).toEqual([ [ userAddress ], [ 500n ] ])
    expect(graphql.calls).toEqual([
      expect.objectContaining({ operationName: 'Vault', variables: lowercaseVariables }),
      expect.objectContaining({ operationName: 'HarvestParams', variables: lowercaseVariables }),
    ])
  })

  it('send', async ({ multicall, mockMulticall }) => {
    const vaultCall = mockMulticall()

    await multicall.checkSend({ ...vaultCall, params, names })
  })

  it('estimateGas', async ({ multicall, mockMulticall }) => {
    const vaultCall = mockMulticall()

    await multicall.checkEstimateGas({ ...vaultCall, params, names })
  })

  it('callStatic', async ({ multicall, mockMulticall }) => {
    const vaultCall = mockMulticall()

    await multicall.checkCallStatic({ ...vaultCall, params: [ positionCall ], values: [ [ 6n ] ] })
  })

  it.for(abiCases)('$name', async ({ values, call }, { multicall, mockMulticall }) => {
    const vaultCall = mockMulticall(values)

    const [ decoded ] = await multicall.checkTransactionData({ ...vaultCall, params: [ call ], names: [ call.method ] })

    expect(decoded.args.toArray()).toEqual(call.args)
  })

  it.for(missingCases)('$name', async ({ values, method }, { sdk, mockMulticall }) => {
    mockMulticall(values)

    const request = sdk.vault.multicall({
      ...baseInput,
      request: { params: [ { method, args: [] } ], transactionData: true },
    })

    await expect(request).rejects.toThrow(method)
  })

  it('invalid vault address', async ({ sdk }) => {
    const request = sdk.vault.multicall({
      ...baseInput,
      vaultAddress: '0x123',
      request: { params: [ positionCall ], transactionData: true },
    })

    await expect(request).rejects.toThrow('The "vaultAddress" argument must be a valid address')
  })
})
