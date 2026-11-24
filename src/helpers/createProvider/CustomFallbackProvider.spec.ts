import { describe, expect, vi } from 'vitest'
import { FallbackProvider, FetchRequest, FetchResponse, JsonRpcProvider, makeError, toUtf8Bytes } from 'ethers'
import type { AbstractProvider } from 'ethers'

import { it, rpcUrl, userAddress } from '../../../test'

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

const createThrottleError = (headers: Record<string, string> = {}) => makeError('server response 429', 'SERVER_ERROR', {
  request: new FetchRequest(rpcUrl),
  response: new FetchResponse(429, 'status', headers, null),
})

const insufficientFundsError = makeError('insufficient funds', 'INSUFFICIENT_FUNDS')

const requestErrorCases = [
  { name: 'revert with data', error: revertError },
  { name: 'revert without data', error: noDataRevertError },
  { name: 'insufficient funds', error: insufficientFundsError },
  { name: 'nonce expired', error: makeError('nonce has already been used', 'NONCE_EXPIRED') },
  { name: 'invalid argument', error: makeError('invalid address', 'INVALID_ARGUMENT') },
]

const hang = () => new Promise<number>(() => {})

const failLater = (delay: number) => new Promise<number>((_, reject) => {
  setTimeout(() => reject(nodeError), delay)
})

const answerLater = (delay: number) => new Promise<number>((resolve) => {
  setTimeout(() => resolve(1), delay)
})

type ThrottleCase = {
  name: string
  headers: Record<string, string>
  pause: number
}

const throttleCases: ThrottleCase[] = [
  { name: '429 with Retry-After', headers: { 'Retry-After': '5' }, pause: 5_000 },
  { name: '429 with long Retry-After', headers: { 'Retry-After': '3600' }, pause: 300_000 },
  { name: '429 without Retry-After', headers: {}, pause: 60_000 },
]

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

const createThreeNodes = (primaryAnswer: Answer, backupAnswer: Answer) => {
  const reserve = createNode(async () => 3)
  const nodes = [ createNode(primaryAnswer), createNode(backupAnswer), reserve ] as unknown as AbstractProvider[]

  const provider = new CustomFallbackProvider(nodes, Network.Mainnet)

  const getBlockNumber = () => provider._perform<number>({ method: 'getBlockNumber' })

  return { reserve, getBlockNumber }
}

type RpcPayload = {
  id: number
}

const createRpcNode = (statusCode: number) => {
  const request = new FetchRequest(rpcUrl)

  const getUrl = vi.fn(async ({ body }: FetchRequest) => {
    const { id } = JSON.parse(new TextDecoder().decode(body!)) as RpcPayload

    return {
      statusCode,
      statusMessage: 'status',
      headers: {},
      body: toUtf8Bytes(JSON.stringify({ id, jsonrpc: '2.0', result: '0x02' })),
    }
  })

  request.getUrlFunc = getUrl

  return {
    getUrl,
    node: new JsonRpcProvider(request, Network.Mainnet, { staticNetwork: true }),
  }
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

  it.for(requestErrorCases)('$name is not retried', async ({ error }) => {
    const { backup, getBlockNumber } = createProvider(async () => { throw error }, async () => 2)

    await expect(getBlockNumber()).rejects.toBe(error)
    expect(backup.getBlockNumber).not.toHaveBeenCalled()
  })

  it('request error does not count as a node failure', async () => {
    const failWithRequestError = async () => { throw insufficientFundsError }
    const { primary, backup, getBlockNumber } = createProvider(failWithRequestError, async () => 2)

    await getBlockNumber().catch(() => {})
    await getBlockNumber().catch(() => {})
    await getBlockNumber().catch(() => {})

    primary.getBlockNumber.mockResolvedValueOnce(1)

    const result = await getBlockNumber()

    expect(result).toBe(1)
    expect(backup.getBlockNumber).not.toHaveBeenCalled()
  })

  it('failed fetch goes to the next node', async () => {
    const { getBlockNumber } = createProvider(async () => { throw new TypeError('Failed to fetch') }, async () => 2)

    const result = await getBlockNumber()

    expect(result).toBe(2)
  })

  it('call error without revert goes to the next node', async () => {
    const { getBlockNumber } = createProvider(async () => { throw rateLimitError }, async () => 2)

    const result = await getBlockNumber()

    expect(result).toBe(2)
  })

  it('broadcast goes to the nodes as is', async () => {
    const { provider, primary, backup } = createProvider(async () => 1, async () => 2)

    const result = await provider._perform<string>({ method: 'broadcastTransaction', signedTransaction: '0x01' })

    expect(result).toBe('0xhash')
    expect(primary._perform).toHaveBeenCalledWith({ method: 'broadcastTransaction', signedTransaction: '0x01' })
    expect(backup._perform).toHaveBeenCalledWith({ method: 'broadcastTransaction', signedTransaction: '0x01' })
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

  it('slow backup does not start the cooling node', async ({ clock }) => {
    const { primary, backup, getBlockNumber } = createProvider(async () => { throw nodeError }, async () => 2)

    await getBlockNumber()
    await getBlockNumber()
    await getBlockNumber()

    backup.getBlockNumber.mockImplementationOnce(() => answerLater(2_000))

    const pending = getBlockNumber()

    await clock.advanceTimersByTimeAsync(2_000)

    await expect(pending).resolves.toBe(1)
    expect(primary.getBlockNumber).toHaveBeenCalledTimes(3)
  })

  it('all nodes are cooling', async ({ clock }) => {
    const { primary, backup, getBlockNumber } = createProvider(
      async () => { throw nodeError },
      async () => { throw backupError }
    )

    await getBlockNumber().catch(() => {})
    await getBlockNumber().catch(() => {})
    await getBlockNumber().catch(() => {})

    primary.getBlockNumber.mockImplementationOnce(hang)
    backup.getBlockNumber.mockResolvedValueOnce(2)

    const pending = getBlockNumber()

    await clock.advanceTimersByTimeAsync(400)

    await expect(pending).resolves.toBe(2)
    expect(primary.getBlockNumber).toHaveBeenCalledTimes(4)
  })

  it('one probe after cooldown', async ({ clock }) => {
    const { primary, getBlockNumber } = createProvider(async () => { throw nodeError }, async () => 2)

    await getBlockNumber()
    await getBlockNumber()
    await getBlockNumber()
    await clock.advanceTimersByTimeAsync(60_000)

    primary.getBlockNumber.mockImplementation(() => failLater(1_000))

    const pending = Promise.all([ getBlockNumber(), getBlockNumber(), getBlockNumber() ])

    await clock.advanceTimersByTimeAsync(1_000)

    await expect(pending).resolves.toEqual([ 2, 2, 2 ])
    expect(primary.getBlockNumber).toHaveBeenCalledTimes(4)
  })

  it('probe ended with the request error ends the cooldown', async ({ clock }) => {
    const { primary, getBlockNumber } = createProvider(async () => { throw nodeError }, async () => 2)

    await getBlockNumber()
    await getBlockNumber()
    await getBlockNumber()
    await clock.advanceTimersByTimeAsync(60_000)

    primary.getBlockNumber.mockRejectedValueOnce(insufficientFundsError)

    await expect(getBlockNumber()).rejects.toBe(insufficientFundsError)

    await getBlockNumber()
    await getBlockNumber()

    expect(primary.getBlockNumber).toHaveBeenCalledTimes(6)
  })

  it('cooldown doubles up to the limit', async ({ clock }) => {
    const { primary, getBlockNumber } = createProvider(async () => { throw nodeError }, async () => 2)
    const expectedPauses = [ 60_000, 120_000, 240_000, 300_000, 300_000 ]

    await getBlockNumber()
    await getBlockNumber()
    await getBlockNumber()

    for (const pause of expectedPauses) {
      primary.getBlockNumber.mockClear()

      await clock.advanceTimersByTimeAsync(pause - 1)
      await getBlockNumber()
      const callsInCooldown = primary.getBlockNumber.mock.calls.length

      await clock.advanceTimersByTimeAsync(1)
      await getBlockNumber()

      expect(callsInCooldown).toBe(0)
      expect(primary.getBlockNumber).toHaveBeenCalledTimes(1)
    }
  })

  it('success resets cooldown', async ({ clock }) => {
    const { primary, getBlockNumber } = createProvider(async () => { throw nodeError }, async () => 2)

    await getBlockNumber()
    await getBlockNumber()
    await getBlockNumber()
    await clock.advanceTimersByTimeAsync(60_000)

    primary.getBlockNumber.mockResolvedValueOnce(1)

    await getBlockNumber()
    await getBlockNumber()
    await getBlockNumber()
    await getBlockNumber()
    primary.getBlockNumber.mockClear()

    await clock.advanceTimersByTimeAsync(60_000)
    await getBlockNumber()

    expect(primary.getBlockNumber).toHaveBeenCalledTimes(1)
  })

  it('parallel failures are one cooldown', async ({ clock }) => {
    const { primary, getBlockNumber } = createProvider(async () => { throw nodeError }, async () => 2)

    await Promise.all(Array.from({ length: 10 }, getBlockNumber))
    primary.getBlockNumber.mockClear()

    await clock.advanceTimersByTimeAsync(60_000)
    await getBlockNumber()

    expect(primary.getBlockNumber).toHaveBeenCalledTimes(1)
  })

  it('last resort failure does not extend cooldown', async ({ clock }) => {
    const { primary, backup, getBlockNumber } = createProvider(async () => { throw nodeError }, async () => 2)

    await getBlockNumber()
    await getBlockNumber()
    await getBlockNumber()

    await clock.advanceTimersByTimeAsync(30_000)
    backup.getBlockNumber.mockRejectedValueOnce(backupError)
    await getBlockNumber().catch(() => {})
    primary.getBlockNumber.mockClear()

    await clock.advanceTimersByTimeAsync(30_000)
    await getBlockNumber()

    expect(primary.getBlockNumber).toHaveBeenCalledTimes(1)
  })

  it.for(throttleCases)('$name', async ({ headers, pause }, { clock }) => {
    const failWithThrottle = async () => { throw createThrottleError(headers) }
    const { primary, getBlockNumber } = createProvider(failWithThrottle, async () => 2)

    const result = await getBlockNumber()

    await clock.advanceTimersByTimeAsync(pause - 1)
    await getBlockNumber()
    const callsInCooldown = primary.getBlockNumber.mock.calls.length

    await clock.advanceTimersByTimeAsync(1)
    await getBlockNumber()

    expect(result).toBe(2)
    expect(callsInCooldown).toBe(1)
    expect(primary.getBlockNumber).toHaveBeenCalledTimes(2)
  })

  it('answer to a request sent before 429 does not end cooldown', async ({ clock }) => {
    const failWithThrottle = async () => { throw createThrottleError() }
    const { primary, getBlockNumber } = createProvider(failWithThrottle, async () => 2)

    primary.getBlockNumber.mockImplementationOnce(() => answerLater(100))

    const pending = getBlockNumber()

    await getBlockNumber()
    await clock.advanceTimersByTimeAsync(100)
    await pending
    await getBlockNumber()

    expect(primary.getBlockNumber).toHaveBeenCalledTimes(2)
  })

  it('Retry-After resets cooldown', async ({ clock }) => {
    const failWithThrottle = async () => { throw createThrottleError({ 'Retry-After': '5' }) }
    const { primary, getBlockNumber } = createProvider(failWithThrottle, async () => 2)

    await getBlockNumber()
    await clock.advanceTimersByTimeAsync(5_000)
    await getBlockNumber()
    await clock.advanceTimersByTimeAsync(5_000)

    primary.getBlockNumber.mockRejectedValueOnce(nodeError)

    await getBlockNumber()
    await clock.advanceTimersByTimeAsync(59_999)
    await getBlockNumber()
    const callsInCooldown = primary.getBlockNumber.mock.calls.length

    await clock.advanceTimersByTimeAsync(1)
    await getBlockNumber()

    expect(callsInCooldown).toBe(3)
    expect(primary.getBlockNumber).toHaveBeenCalledTimes(4)
  })

  it('failure of a request sent before 429 is not a failed probe', async ({ clock }) => {
    const { primary, getBlockNumber } = createProvider(async () => 1, async () => 2)

    primary.getBlockNumber
      .mockImplementationOnce(() => failLater(3_000))
      .mockRejectedValueOnce(createThrottleError({ 'Retry-After': '1' }))

    const pending = getBlockNumber()

    await getBlockNumber()
    await clock.advanceTimersByTimeAsync(3_000)
    await pending

    const result = await getBlockNumber()

    expect(result).toBe(1)
  })

  it('failure next to the running probe does not hide its answer', async ({ clock }) => {
    const { primary, backup, getBlockNumber } = createProvider(async () => 1, async () => 2)

    primary.getBlockNumber.mockRejectedValueOnce(nodeError)
    backup.getBlockNumber.mockRejectedValueOnce(createThrottleError({ 'Retry-After': '1' }))

    await getBlockNumber().catch(() => {})
    await getBlockNumber()
    await clock.advanceTimersByTimeAsync(1_000)

    primary.getBlockNumber.mockRejectedValueOnce(nodeError).mockRejectedValueOnce(nodeError)
    backup.getBlockNumber.mockImplementationOnce(() => answerLater(100)).mockRejectedValueOnce(backupError)

    const pending = Promise.allSettled([ getBlockNumber(), getBlockNumber() ])

    await clock.advanceTimersByTimeAsync(100)
    await pending

    primary.getBlockNumber.mockImplementationOnce(() => answerLater(2_000))

    const next = getBlockNumber()

    await clock.advanceTimersByTimeAsync(2_000)

    await expect(next).resolves.toBe(2)
  })

  it('late failure after the answer does not start the next node', async ({ clock }) => {
    const { reserve, getBlockNumber } = createThreeNodes(() => failLater(1_000), async () => 2)

    const pending = getBlockNumber()

    await clock.advanceTimersByTimeAsync(1_000)

    await expect(pending).resolves.toBe(2)
    expect(reserve.getBlockNumber).not.toHaveBeenCalled()
  })

  it('late failure after the request error does not start the next node', async ({ clock }) => {
    const { reserve, getBlockNumber } = createThreeNodes(() => failLater(1_000), async () => { throw revertError })

    const pending = getBlockNumber().catch((error) => error)

    await clock.advanceTimersByTimeAsync(1_000)

    await expect(pending).resolves.toBe(revertError)
    expect(reserve.getBlockNumber).not.toHaveBeenCalled()
  })

  it('failed node does not start the next node twice', async ({ clock }) => {
    const { reserve, getBlockNumber } = createThreeNodes(() => failLater(300), () => answerLater(350))

    const pending = getBlockNumber()

    await clock.advanceTimersByTimeAsync(650)

    await expect(pending).resolves.toBe(1)
    expect(reserve.getBlockNumber).not.toHaveBeenCalled()
  })

  it('network detection does not reset failures', async () => {
    const primary = createRpcNode(502)
    const backup = createRpcNode(200)
    const provider = new CustomFallbackProvider([ primary.node, backup.node ], Network.Mainnet)

    const blockTags = [ 1, 2, 3, 4, 5 ]
    const balances: bigint[] = []

    for (const blockTag of blockTags) {
      const balance = await provider.getBalance(userAddress, blockTag)

      balances.push(balance)
    }

    expect(balances).toEqual([ 2n, 2n, 2n, 2n, 2n ])
    expect(primary.getUrl).toHaveBeenCalledTimes(3)
  })
})
