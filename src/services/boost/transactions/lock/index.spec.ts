import { describe, expect } from 'vitest'
import type { BaseContract } from 'ethers'
import { MaxUint256, ZeroAddress } from 'ethers'

import {
  userAddress,
  decodeCalls,
  subgraphUrl,
  it as baseIt,
  vaultAddress,
  accessDenied,
  spenderAddress,
  checksumAddress,
  checkHarvestParams,
} from '../../../../../test'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'

import type { LockInput } from './types'
import type { LockEncodeOutput } from './lockEncode'
import type { LeverageStrategyDataQueryPayload } from '../../../../graphql/subgraph/boost'


type Input = StakeWise.ExtractInput<LockInput>

type Positions = LeverageStrategyDataQueryPayload['leverageStrategyPositions']

type MockLockInput = {
  code?: string
  allowance?: bigint
  canHarvest?: boolean
  positions?: Positions
}

type Call = {
  name: string
  args: unknown[]
}

type EncodeCase = {
  name: string
  values: MockLockInput
  extra: Partial<Input>
  contractName: 'leverageStrategy' | 'leverageStrategyV2'
  calls: Call[]
  hasApprove: boolean
  hasUpgrade: boolean
  strategyRequests: Array<Record<string, unknown>>
}

const amount = 10n
const approveAmount = 25n
const strategyProxy = '0x5555555555555555555555555555555555555555'

const nowSeconds = 1_800_000_000
const permitDuration = 3600

const r = `0x${'11'.repeat(32)}`
const s = `0x${'22'.repeat(32)}`
const signature = `${r}${s.slice(2)}1b`

const safeCode = '0x6080604052'
const delegatedCode = `0xEF0100${spenderAddress.slice(2)}`

const v2Data = { version: 2, isUpgradeRequired: false }
const v1Data = { version: 1, isUpgradeRequired: false }
const upgradeData = { version: 1, isUpgradeRequired: true }

const permitParams = {
  v: 28,
  amount: 5n,
  vault: checksumAddress,
  deadline: 1_900_000_000,
  r: `0x${'33'.repeat(32)}`,
  s: `0x${'44'.repeat(32)}`,
}

const input = {
  userAddress,
  vaultAddress,
  amount,
  leverageStrategyData: v2Data,
}
const order: Array<keyof LockEncodeOutput> = [ 'upgradeLeverageStrategyTxData', 'approveTxData', 'lockTxData' ]

const strategyRequest = {
  url: subgraphUrl,
  operationName: 'LeverageStrategyData',
  variables: { userAddress, vaultAddress },
}

const harvestRequest = {
  url: subgraphUrl,
  operationName: 'HarvestParams',
  variables: { address: vaultAddress },
}

const deposit = { name: 'deposit', args: [ vaultAddress, amount, ZeroAddress ] }

const signedPermit = {
  name: 'permit',
  args: [ vaultAddress, amount, BigInt(nowSeconds + permitDuration), 27n, r, s ],
}

const givenPermit = {
  name: 'permit',
  args: [ checksumAddress, 5n, 1_900_000_000n, 28n, permitParams.r, permitParams.s ],
}

const encodeCases: EncodeCase[] = [
  {
    name: 'referrer',
    values: {},
    extra: { referrerAddress: checksumAddress },
    contractName: 'leverageStrategyV2',
    calls: [ { name: 'deposit', args: [ vaultAddress, amount, checksumAddress ] } ],
    hasApprove: false,
    hasUpgrade: false,
    strategyRequests: [],
  },
  {
    name: 'v1 strategy',
    values: {},
    extra: { leverageStrategyData: v1Data },
    contractName: 'leverageStrategy',
    calls: [ deposit ],
    hasApprove: false,
    hasUpgrade: false,
    strategyRequests: [],
  },
  {
    name: 'allowance equals amount',
    values: { allowance: amount },
    extra: {},
    contractName: 'leverageStrategyV2',
    calls: [ deposit ],
    hasApprove: false,
    hasUpgrade: false,
    strategyRequests: [],
  },
  {
    name: 'permit signature',
    values: { allowance: amount - 1n },
    extra: {},
    contractName: 'leverageStrategyV2',
    calls: [ signedPermit, deposit ],
    hasApprove: false,
    hasUpgrade: false,
    strategyRequests: [],
  },
  {
    name: 'permit params',
    values: {},
    extra: { permitParams },
    contractName: 'leverageStrategyV2',
    calls: [ givenPermit, deposit ],
    hasApprove: false,
    hasUpgrade: false,
    strategyRequests: [],
  },
  {
    name: 'approve not required',
    values: {},
    extra: { approveParams: { amount: approveAmount } },
    contractName: 'leverageStrategyV2',
    calls: [ deposit ],
    hasApprove: false,
    hasUpgrade: false,
    strategyRequests: [],
  },
  {
    name: 'multisig',
    values: { allowance: 0n, code: safeCode },
    extra: { permitParams },
    contractName: 'leverageStrategyV2',
    calls: [ deposit ],
    hasApprove: true,
    hasUpgrade: false,
    strategyRequests: [],
  },
  {
    name: 'eip-7702',
    values: { allowance: 0n, code: delegatedCode },
    extra: {},
    contractName: 'leverageStrategyV2',
    calls: [ signedPermit, deposit ],
    hasApprove: false,
    hasUpgrade: false,
    strategyRequests: [],
  },
  {
    name: 'fetched upgrade',
    values: { positions: [ { version: '1', exitingPercent: '0' } ] },
    extra: { leverageStrategyData: undefined },
    contractName: 'leverageStrategyV2',
    calls: [ deposit ],
    hasApprove: false,
    hasUpgrade: true,
    strategyRequests: [ strategyRequest ],
  },
]

const approveCases = [
  {
    name: 'approve transaction',
    values: { allowance: 0n },
    extra: { approveParams: { amount: approveAmount } },
    approveArgs: [ strategyProxy, approveAmount ],
  },
  {
    name: 'multisig approve transaction',
    values: { allowance: 0n, code: safeCode },
    extra: {},
    approveArgs: [ strategyProxy, MaxUint256 ],
  },
]

const sendCases = [
  {
    name: 'send with permit',
    values: { allowance: 0n },
    extra: {},
  },
  {
    name: 'send upgrade and approve',
    values: { allowance: 0n, code: safeCode },
    extra: { leverageStrategyData: upgradeData },
  },
]

const estimateGasCases = [
  {
    name: 'estimateGas with permit params',
    values: { allowance: 0n },
    extra: { permitParams },
  },
  {
    name: 'estimateGas with upgrade',
    values: { allowance: 0n, code: safeCode },
    extra: { leverageStrategyData: upgradeData },
  },
]

const invalidCases = [
  baseInputWiringCase,
  {
    name: 'invalid amount',
    input: { ...input, amount: '10' },
    message: 'The "amount" argument must be of type bigint',
  },
  {
    name: 'missing amount',
    input: { userAddress, vaultAddress, leverageStrategyData: v2Data },
    message: 'The "amount" argument',
  },
  {
    name: 'invalid referrer address',
    input: { ...input, referrerAddress: '0x123' },
    message: 'The "referrerAddress" argument must be a valid address',
  },
  {
    name: 'zero approve amount',
    input: { ...input, approveParams: { amount: 0n } },
    message: 'The "approveParams.amount" argument must be greater than 0',
  },
  {
    name: 'negative approve amount',
    input: { ...input, approveParams: { amount: -1n } },
    message: 'The "approveParams.amount" argument must be greater than 0',
  },
  {
    name: 'invalid approve amount',
    input: { ...input, approveParams: { amount: '25' } },
    message: 'The "approveParams.amount" argument must be of type bigint',
  },
  {
    name: 'invalid strategy data',
    input: { ...input, leverageStrategyData: { version: '2', isUpgradeRequired: false } },
    message: 'The "leverageStrategyData.version" argument must be a number',
  },
  {
    name: 'invalid permit vault',
    input: { ...input, permitParams: { ...permitParams, vault: '0x123' } },
    message: 'The "permitParams.vault" argument must be a valid address',
  },
  {
    name: 'invalid permit amount',
    input: { ...input, permitParams: { ...permitParams, amount: 5 } },
    message: 'The "permitParams.amount" argument must be of type bigint',
  },
  {
    name: 'invalid permit r',
    input: { ...input, permitParams: { ...permitParams, r: 1 } },
    message: 'The "permitParams.r" argument must be a string',
  },
  {
    name: 'invalid permit s',
    input: { ...input, permitParams: { ...permitParams, s: 1 } },
    message: 'The "permitParams.s" argument must be a string',
  },
  {
    name: 'invalid permit v',
    input: { ...input, permitParams: { ...permitParams, v: '28' } },
    message: 'The "permitParams.v" argument must be a number',
  },
  {
    name: 'invalid permit deadline',
    input: { ...input, permitParams: { ...permitParams, deadline: '1900000000' } },
    message: 'The "permitParams.deadline" argument must be a number',
  },
]

const getCalls = (targetContract: BaseContract, transaction: StakeWise.TransactionData | null): Call[] => (
  transaction
    ? decodeCalls(targetContract, transaction.data).map(({ name, args }) => ({ name, args: args.toArray() }))
    : []
)

const it = baseIt.extend('mockLock', ({ sdk, runner, mockLeverageStrategy }) => (
  (values: MockLockInput = {}) => {
    const { code = '0x', allowance = 1000n, canHarvest = false, positions = [] } = values
    const mintTokenContract = sdk.contracts.tokens.mintToken
    const leverageStrategyV2Contract = mockLeverageStrategy({
      positions,
      canHarvest,
      answers: { permit: [], deposit: [] },
    })

    runner.on(leverageStrategyV2Contract, {
      getStrategyProxy: ([ vault, user ]) => {
        const isOwner = vault === vaultAddress && user === userAddress

        return [ isOwner ? strategyProxy : ZeroAddress ]
      },
    })
    runner.on(mintTokenContract, {
      name: [ 'osETH' ],
      nonces: [ 7n ],
      approve: [ true ],
      allowance: ([ owner, spender ]) => {
        const isOwner = owner === userAddress && spender === strategyProxy

        return [ isOwner ? allowance : 0n ]
      },
    })
    runner.setCode(userAddress, code)
    runner.onRpc('eth_signTypedData_v4', () => signature)

    return leverageStrategyV2Contract
  }
))

describe('lock', () => {

  it.beforeEach(({ clock }) => {
    clock.setSystemTime(nowSeconds * 1000)
  })

  it.for(encodeCases)('$name', async (encodeCase, { sdk, graphql, mockLock }) => {
    const { values, extra, contractName, calls, hasApprove, hasUpgrade, strategyRequests } = encodeCase

    mockLock(values)

    const leverageStrategyContract = sdk.contracts.special[contractName]
    const [ tx, address ] = await Promise.all([
      sdk.boost.lock.encode({ ...input, ...extra }),
      leverageStrategyContract.getAddress(),
    ])
    const { lockTxData, approveTxData, upgradeLeverageStrategyTxData } = tx
    const strategyCalls = graphql.calls.filter(({ operationName }) => operationName === strategyRequest.operationName)
    const lockCalls = getCalls(leverageStrategyContract, lockTxData)
    const expectedRequests = strategyRequests.map((request) => expect.objectContaining(request))
    const hasApproveTx = Boolean(approveTxData)
    const hasUpgradeTx = Boolean(upgradeLeverageStrategyTxData)

    expect(lockTxData.to).toBe(address)
    expect(lockCalls).toEqual(calls)
    expect(hasApproveTx).toBe(hasApprove)
    expect(hasUpgradeTx).toBe(hasUpgrade)
    expect(strategyCalls).toEqual(expectedRequests)
  })

  it.for(approveCases)('$name', async ({ values, extra, approveArgs }, { sdk, mockLock }) => {
    mockLock(values)

    const mintTokenContract = sdk.contracts.tokens.mintToken
    const [ tx, address ] = await Promise.all([
      sdk.boost.lock.encode({ ...input, ...extra }),
      mintTokenContract.getAddress(),
    ])
    const { approveTxData } = tx
    const calls = getCalls(mintTokenContract, approveTxData)

    expect(approveTxData!.to).toBe(address)
    expect(calls).toEqual([ { name: 'approve', args: approveArgs } ])
  })

  it('permit request', async ({ sdk, runner, mockLock }) => {
    mockLock({ allowance: 0n })

    const [ , mintTokenAddress ] = await Promise.all([
      sdk.boost.lock.encode(input),
      sdk.contracts.tokens.mintToken.getAddress(),
    ])
    const [ { method, params } ] = runner.rpcCalls
    const [ signer, typedData ] = params
    const { domain, message } = JSON.parse(typedData)

    expect(runner.rpcCalls).toHaveLength(1)
    expect(method).toBe('eth_signTypedData_v4')
    expect(signer).toBe(userAddress)
    expect(domain.verifyingContract).toBe(mintTokenAddress)
    expect(message).toMatchObject({
      nonce: '7',
      owner: userAddress,
      spender: strategyProxy,
      value: amount.toString(),
    })
  })

  it.for(sendCases)('$name', async ({ values, extra }, { sdk, transaction, mockLock }) => {
    mockLock(values)

    await transaction.checkSendList({
      order,
      method: sdk.boost.lock,
      input: { ...input, ...extra },
    })
  })

  it.for(estimateGasCases)('$name', async ({ values, extra }, { sdk, transaction, mockLock }) => {
    mockLock(values)

    await transaction.checkEstimateGasList({
      order,
      method: sdk.boost.lock,
      input: { ...input, ...extra },
    })
  })

  it('wait for approve', async ({ sdk, runner, mockLock }) => {
    mockLock({ allowance: 0n, code: safeCode })

    await sdk.boost.lock(input)

    expect(runner.waited).toEqual([ `0x${'0'.repeat(63)}1` ])
  })

  it('with harvest', async ({ sdk, graphql, mockLock }) => {
    const leverageStrategyContract = mockLock({ canHarvest: true })

    const { lockTxData } = await sdk.boost.lock.encode(input)
    const calls = decodeCalls(leverageStrategyContract, lockTxData.data)
    const callNames = calls.map(({ name }) => name)
    const [ vault, harvestParams ] = calls[0].args

    expect(callNames).toEqual([ 'updateVaultState', 'deposit' ])
    expect(vault).toBe(vaultAddress)
    checkHarvestParams(harvestParams)
    expect(graphql.calls).toContainEqual(expect.objectContaining(harvestRequest))
  })

  it('approve revert', async ({ sdk, runner, mockLock }) => {
    mockLock({ allowance: 0n, code: safeCode })

    runner.revert(sdk.contracts.tokens.mintToken, 'approve', accessDenied)

    const request = sdk.boost.lock(input)

    await expect(request).rejects.toMatchObject({ name: 'AccessDenied', message: '[transaction call failed]:' })
    expect(runner.sent).toHaveLength(0)
  })

  it.for(invalidCases)('$name', async ({ input: invalidInput, message }, { sdk, mockLock }) => {
    mockLock()

    const request = sdk.boost.lock.encode(invalidInput as Input)

    await expect(request).rejects.toThrow(message)
  })
})
