import { vi, describe, expect, beforeEach } from 'vitest'

import { it, vaultAddress } from '..'
import getCode from './getCode'


const code = '0x6080'

const input = {
  block: 100,
  address: vaultAddress,
  rpcUrl: 'https://rpc.test',
}

const fetchMock = vi.fn<typeof fetch>()

const mockStatuses = (statuses: number[]) => {
  statuses.forEach((status) => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ result: code }), { status }))
  })
}

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

describe('getCode', () => {
  it('retries 429', async ({ clock }) => {
    mockStatuses([ 429, 429, 200 ])

    const result = getCode(input)

    await clock.advanceTimersByTimeAsync(999)

    expect(fetchMock).toHaveBeenCalledTimes(1)

    await clock.advanceTimersByTimeAsync(1)

    expect(fetchMock).toHaveBeenCalledTimes(2)

    await clock.advanceTimersByTimeAsync(1999)

    expect(fetchMock).toHaveBeenCalledTimes(2)

    await clock.advanceTimersByTimeAsync(1)

    expect(fetchMock).toHaveBeenCalledTimes(3)
    await expect(result).resolves.toBe(code)
  })

  it('gives up', async ({ clock }) => {
    mockStatuses([ 429, 429, 429, 429, 429, 200 ])

    const result = getCode(input).catch((error: Error) => error.message)

    await clock.advanceTimersByTimeAsync(10_000)

    expect(fetchMock).toHaveBeenCalledTimes(5)
    await expect(result).resolves.toBe('RPC responded with HTTP 429')
  })

  it('other status', async () => {
    mockStatuses([ 500, 200 ])

    const result = getCode(input)

    await expect(result).rejects.toThrow('RPC responded with HTTP 500')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
