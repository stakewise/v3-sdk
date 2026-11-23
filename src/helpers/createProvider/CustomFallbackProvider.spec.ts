import { describe, expect, vi } from 'vitest'
import { FallbackProvider, makeError } from 'ethers'
import type { AbstractProvider } from 'ethers'

import { it } from '../../../test'

import { Network } from '../enums'

import CustomFallbackProvider from './CustomFallbackProvider'


type Answer = () => Promise<number>

const nodeError = makeError('bad response', 'SERVER_ERROR')
const backupError = makeError('request timeout', 'TIMEOUT')
const revertError = makeError('execution reverted', 'CALL_EXCEPTION', { data: '0x08c379a0' } as never)

const createCallError = (nodeMessage: string) => (
  makeError('missing revert data', 'CALL_EXCEPTION', { info: { error: { message: nodeMessage } } } as never)
)

const noDataRevertError = createCallError('execution reverted')
const rateLimitError = createCallError('rate limit exceeded')

const revertCases = [
  { name: 'revert with data', error: revertError },
  { name: 'revert without data', error: noDataRevertError },
]

const hang = () => new Promise<number>(() => {})

const failLater = (delay: number) => new Promise<number>((_, reject) => {
  setTimeout(() => reject(nodeError), delay)
})

const createNode = (answer: Answer) => ({
  getBlockNumber: vi.fn(answer),
  _perform: vi.fn(async () => '0xhash'),
})

const createProvider = (primaryAnswer: Answer, backupAnswer: Answer) => {
  const primary = createNode(primaryAnswer)
  const backup = createNode(backupAnswer)

  const provider = new CustomFallbackProvider([ primary, backup ] as unknown as AbstractProvider[], Network.Mainnet)

  const getBlockNumber = () => provider._perform<number>({ method: 'getBlockNumber' })

  return { provider, primary, backup, getBlockNumber }
}

describe('CustomFallbackProvider', () => {

  it('first node answers', async () => {
    const { provider, backup, getBlockNumber } = createProvider(async () => 1, async () => 2)

    const result = await getBlockNumber()

    expect(provider).toBeInstanceOf(FallbackProvider)
    expect(result).toBe(1)
    expect(backup.getBlockNumber).not.toHaveBeenCalled()
  })

  it('node error goes to the next node', async () => {
    const { primary, getBlockNumber } = createProvider(async () => { throw nodeError }, async () => 2)

    const result = await getBlockNumber()

    expect(result).toBe(2)
    expect(primary.getBlockNumber).toHaveBeenCalledTimes(1)
  })

  it.for(revertCases)('$name is not retried', async ({ error }) => {
    const { backup, getBlockNumber } = createProvider(async () => { throw error }, async () => 2)

    await expect(getBlockNumber()).rejects.toBe(error)
    expect(backup.getBlockNumber).not.toHaveBeenCalled()
  })

  it('call error without revert goes to the next node', async () => {
    const { getBlockNumber } = createProvider(async () => { throw rateLimitError }, async () => 2)

    const result = await getBlockNumber()

    expect(result).toBe(2)
  })

  it('broadcast goes to the nodes as is', async () => {
    const { provider, primary } = createProvider(async () => 1, async () => 2)

    const result = await provider._perform<string>({ method: 'broadcastTransaction', signedTransaction: '0x01' })

    expect(result).toBe('0xhash')
    expect(primary._perform).toHaveBeenCalledWith({ method: 'broadcastTransaction', signedTransaction: '0x01' })
  })

  it('all nodes fail', async () => {
    const { getBlockNumber } = createProvider(async () => { throw nodeError }, async () => { throw backupError })

    await expect(getBlockNumber()).rejects.toBe(backupError)
  })

  it('stalled node', async ({ clock }) => {
    const { backup, getBlockNumber } = createProvider(hang, async () => 2)

    const pending = getBlockNumber()

    await clock.advanceTimersByTimeAsync(399)
    const calledBeforeStall = backup.getBlockNumber.mock.calls.length

    await clock.advanceTimersByTimeAsync(1)

    await expect(pending).resolves.toBe(2)
    expect(calledBeforeStall).toBe(0)
  })

  it('stalled node fails after the next node', async ({ clock }) => {
    const { getBlockNumber } = createProvider(() => failLater(1_000), async () => { throw backupError })

    const pending = getBlockNumber()
    const settled = vi.fn()

    pending.catch(settled)

    await clock.advanceTimersByTimeAsync(999)
    const settledBeforeFirstNode = settled.mock.calls.length

    await clock.advanceTimersByTimeAsync(1)

    await expect(pending).rejects.toBe(nodeError)
    expect(settledBeforeFirstNode).toBe(0)
  })

  it('cooldown after failures', async ({ clock }) => {
    const { primary, getBlockNumber } = createProvider(async () => { throw nodeError }, async () => 2)

    await getBlockNumber()
    await getBlockNumber()
    await getBlockNumber()
    await getBlockNumber()
    const callsInCooldown = primary.getBlockNumber.mock.calls.length

    await clock.advanceTimersByTimeAsync(60_000)
    await getBlockNumber()

    expect(callsInCooldown).toBe(3)
    expect(primary.getBlockNumber).toHaveBeenCalledTimes(4)
  })

  it('cooling node is the last resort', async () => {
    const { primary, backup, getBlockNumber } = createProvider(async () => { throw nodeError }, async () => 2)

    await getBlockNumber()
    await getBlockNumber()
    await getBlockNumber()

    primary.getBlockNumber.mockResolvedValueOnce(1)
    backup.getBlockNumber.mockRejectedValueOnce(backupError)

    const result = await getBlockNumber()

    expect(result).toBe(1)
  })

  it('success resets failures', async () => {
    const { primary, getBlockNumber } = createProvider(async () => { throw nodeError }, async () => 2)

    primary.getBlockNumber
      .mockRejectedValueOnce(nodeError)
      .mockRejectedValueOnce(nodeError)
      .mockResolvedValueOnce(1)

    await getBlockNumber()
    await getBlockNumber()
    await getBlockNumber()
    await getBlockNumber()
    await getBlockNumber()
    await getBlockNumber()

    expect(primary.getBlockNumber).toHaveBeenCalledTimes(6)
  })
})
