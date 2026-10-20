import { describe, expect, vi } from 'vitest'
import { getAddress, MaxUint256, parseEther, ZeroAddress } from 'ethers'

import { it, userAddress, decodeCalls } from '../../../../../test'
import mockGraphql from '../../../../../test/mockGraphql'
import {
  forkAbis,
  useForkSdk,
  fundAccount,
  parseEvents,
  extendContract,
  pickTransaction,
  getForkHarvestArgs,
  sendForkTransaction,
  approveStrategyProxy,
  mockForkHarvestParams,
} from '../../../../../test/fork'

import type { LockInput } from './types'
import type { Fork } from '../../../../../test/fork'
import type { LeverageStrategyDataQueryPayload } from '../../../../graphql/subgraph/boost'


type Call = {
  name: string
  args: unknown[]
}

type SendCall = [ string, Array<{ data: string }> ]

const lockerAddress = '0x3f294e22455ecFcE652E2CFE1610ab7bFB4e87C9'
const permitOwnerAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

const amount = parseEther('0.1')

const prepareLock = async (setupFork: Fork) => {
  const { sdk, provider, snapshot } = setupFork
  const lockerSigner = await provider.getSigner(lockerAddress)
  const lockerMintTokenContract = sdk.contracts.tokens.mintToken.connect(lockerSigner)

  const transferOsToken = async (recipientAddress: string) => {
    const transferTx = await lockerMintTokenContract.transfer(recipientAddress, amount)
    const transferReceipt = await transferTx.wait()

    expect(transferReceipt?.status, 'the setup transfer must succeed').toBe(1)
  }

  await Promise.all([
    fundAccount(provider, lockerAddress),
    fundAccount(provider, permitOwnerAddress),
  ])

  await approveStrategyProxy(setupFork, { amount, userAddress: lockerAddress })
  await transferOsToken(permitOwnerAddress)
  await transferOsToken(userAddress)

  const canHarvest = await sdk.contracts.base.keeper.canHarvest(snapshot.vaultAddress)

  expect(canHarvest, 'fixture does not match the fork block').toBe(true)
}

describe('lock', () => {
  const { sdk, provider, snapshot } = useForkSdk({ setup: prepareLock })
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
  const leverageStrategyContract = extendContract(sdk.contracts.special.leverageStrategyV2, forkAbis.leverageStrategy)

  const harvestCall = { name: 'updateVaultState', args: [ vaultAddress, getForkHarvestArgs(snapshot) ] }
  const depositCall = { name: 'deposit', args: [ vaultAddress, amount, ZeroAddress ] }

  const mockLockRequests = () => {
    mockForkHarvestParams(snapshot, true)

    mockGraphql<LeverageStrategyDataQueryPayload>({
      name: 'LeverageStrategyData',
      data: { leverageStrategyPositions: [] },
    })
  }

  const sendLock = async (input: StakeWise.ExtractInput<LockInput>, calls: Call[]) => {
    const { userAddress } = input

    mockLockRequests()

    const proxyAddress = await leverageStrategyContract.getStrategyProxy(vaultAddress, userAddress)

    const { receipt } = await sendForkTransaction({
      input,
      calls,
      provider,
      contract: leverageStrategyContract,
      method: pickTransaction(sdk.boost.lock, 'lockTxData'),
    })

    const [ canHarvest, allowance, proxyShares, strategyEvents ] = await Promise.all([
      sdk.contracts.base.keeper.canHarvest(vaultAddress),
      sdk.contracts.tokens.mintToken.allowance(userAddress, proxyAddress),
      vaultContract.getShares(proxyAddress),
      parseEvents(leverageStrategyContract, receipt),
    ])

    const deposited = strategyEvents.find((event) => event?.name === 'Deposited')

    return {
      deposited,
      allowance,
      canHarvest,
      proxyShares,
    }
  }

  it('approve mode', async () => {
    const input = {
      amount,
      vaultAddress,
      approveParams: { amount },
      userAddress: lockerAddress,
    }

    const calls = [ harvestCall, depositCall ]
    const { canHarvest, allowance, proxyShares, deposited } = await sendLock(input, calls)

    expect(canHarvest).toBe(false)
    expect(allowance).toBe(0n)
    expect(proxyShares).toBeGreaterThan(0n)
    expect(deposited?.args.user).toBe(lockerAddress)
    expect(deposited?.args.osTokenShares).toBe(amount)
  })

  it('permit mode', async () => {
    const proxyAddress = await leverageStrategyContract.getStrategyProxy(vaultAddress, permitOwnerAddress)

    const signature = await sdk.utils.getPermitSignature({
      contract: sdk.contracts.tokens.mintToken,
      spenderAddress: proxyAddress,
      ownerAddress: permitOwnerAddress,
    })

    const { deadline, v, r, s } = signature

    const input = {
      amount,
      vaultAddress,
      userAddress: permitOwnerAddress,
      permitParams: { ...signature, vault: vaultAddress },
    }

    const permitCall = {
      name: 'permit',
      args: [ vaultAddress, MaxUint256, BigInt(deadline), BigInt(v), r, s ],
    }

    const calls = [ harvestCall, permitCall, depositCall ]
    const { canHarvest, allowance, proxyShares, deposited } = await sendLock(input, calls)

    expect(canHarvest).toBe(false)
    expect(allowance).toBe(MaxUint256)
    expect(proxyShares).toBeGreaterThan(0n)
    expect(deposited?.args.user).toBe(permitOwnerAddress)
    expect(deposited?.args.osTokenShares).toBe(amount)
  })

  it('approve and lock', async () => {
    const input = {
      amount,
      userAddress,
      vaultAddress,
      approveParams: { amount },
    }

    mockLockRequests()

    const sendSpy = vi.spyOn(provider, 'send')
    const lockHash = await sdk.boost.lock(input)
    const sendCalls = sendSpy.mock.calls as SendCall[]
    const sendResults = sendSpy.mock.results

    sendSpy.mockRestore()

    const sentIndexes = sendCalls.flatMap(([ method ], index) => (method === 'eth_sendTransaction' ? [ index ] : []))
    const sentHashes: string[] = await Promise.all(sentIndexes.map((index) => sendResults[index].value))
    const [ approveData, lockData ] = sentIndexes.map((index) => sendCalls[index][1][0].data)

    const [ proxyAddress, mintTokenAddress, leverageStrategyAddress ] = await Promise.all([
      leverageStrategyContract.getStrategyProxy(vaultAddress, userAddress),
      sdk.contracts.tokens.mintToken.getAddress(),
      leverageStrategyContract.getAddress(),
    ])

    const [ receipts, proxyShares ] = await Promise.all([
      Promise.all(sentHashes.map((hash) => provider.getTransactionReceipt(hash))),
      vaultContract.getShares(proxyAddress),
    ])

    const sentTargets = receipts.map((receipt) => receipt?.to)
    const sentStatuses = receipts.map((receipt) => receipt?.status)
    const approveCalldata = sdk.contracts.tokens.mintToken.interface.encodeFunctionData('approve', [ proxyAddress, amount ])
    const lockCalls = decodeCalls(leverageStrategyContract, lockData)
      .map(({ name, args }) => ({ name, args: args.toArray() }))

    expect(sentHashes).toHaveLength(2)
    expect(sentHashes[1]).toBe(lockHash)
    expect(sentTargets).toEqual([ mintTokenAddress, leverageStrategyAddress ])
    expect(sentStatuses).toEqual([ 1, 1 ])
    expect(approveData).toBe(approveCalldata)
    expect(lockCalls).toEqual([ harvestCall, depositCall ])
    expect(proxyShares).toBeGreaterThan(0n)
  })
})
