import { describe, expect, beforeEach, afterEach, vi } from 'vitest'

import { it } from '../../../test'

import AbortRequest from './abortRequest'


const url = 'https://example.com'

const sameBodyOptions = {
  method: 'POST',
  body: 'sameBody',
  onSuccess: (data: string) => data,
}

const fetchMock = vi.fn<typeof fetch>()

const mockResponse = (body: string) => fetchMock.mockImplementation(async () => new Response(body))
const mockReject = (error: Error) => fetchMock.mockImplementation(async () => {
  throw error
})

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  fetchMock.mockReset()
})

describe('AbortRequest', () => {
  it('resolves modified data', async () => {
    const mock = { test: 'response data' }

    mockResponse(JSON.stringify({ data: mock }))

    const abortRequest = new AbortRequest<{ test: string }, string>(url, {
      method: 'GET',
      onSuccess: (data) => data.test,
    })

    const result = await abortRequest

    expect(result).toEqual(mock.test)
    expect(fetchMock.mock.calls.length).toBe(1)
  })

  it('requests the url from getUrl', async () => {
    const backupUrl = 'https://backup.example.com'

    mockResponse(JSON.stringify({ data: 'response data' }))

    const abortRequest1 = new AbortRequest(url, { ...sameBodyOptions, getUrl: async () => backupUrl })
    const abortRequest2 = new AbortRequest(url, { ...sameBodyOptions, getUrl: async () => backupUrl })

    expect(abortRequest1.request).toBe(abortRequest2.request)
    expect(await abortRequest1).toEqual('response data')
    expect(fetchMock.mock.calls).toEqual([ [ backupUrl, expect.objectContaining({ body: 'sameBody' }) ] ])
  })

  it('same body', async () => {
    const mock = 'response data'

    mockResponse(JSON.stringify({ data: mock }))

    const abortRequest1 = new AbortRequest(url, sameBodyOptions)
    const abortRequest2 = new AbortRequest(url, sameBodyOptions)

    expect(abortRequest1.request).toBe(abortRequest2.request)

    const [ result1, result2 ] = await Promise.all([
      abortRequest1,
      abortRequest2,
    ])

    expect(result1).toEqual(mock)
    expect(result2).toEqual(mock)
    expect(fetchMock.mock.calls.length).toBe(1)
  })

  it('abort one of two', async () => {
    const mock = 'response data'

    mockResponse(JSON.stringify({ data: mock }))

    const abortRequest1 = new AbortRequest(url, sameBodyOptions)
    const abortRequest2 = new AbortRequest(url, sameBodyOptions)

    abortRequest1.abort()

    const result = await abortRequest2

    expect(result).toEqual(mock)
    expect(fetchMock.mock.calls.length).toBe(1)
  })

  it('abort after chain', async () => {
    mockResponse(JSON.stringify({ data: 'response data' }))

    const catchCallback = vi.fn()
    const finallyCallback = vi.fn()
    const onSuccessCallback = vi.fn()
    const thenErrorCallback = vi.fn()
    const thenSuccessCallback = vi.fn()

    const initialRequest = new AbortRequest(url, {
      method: 'POST',
      body: 'sameBody',
      onSuccess: onSuccessCallback,
    })
    const abortRequest = initialRequest
      .then(thenSuccessCallback, thenErrorCallback)
      .catch(catchCallback)
      .finally(finallyCallback)

    abortRequest.abort()

    const [ , requestInit ] = fetchMock.mock.calls[0]

    expect(requestInit?.signal?.aborted).toEqual(true)
    expect(fetchMock.mock.calls.length).toBe(1)
    expect(thenSuccessCallback).not.toHaveBeenCalled()
    expect(thenErrorCallback).not.toHaveBeenCalled()
    expect(catchCallback).not.toHaveBeenCalled()
    expect(finallyCallback).not.toHaveBeenCalled()
    expect(onSuccessCallback).not.toHaveBeenCalled()
  })

  it('catch error', async () => {
    const message = 'Request failed'

    mockReject(new Error(message))

    const abortRequest = new AbortRequest(url, {
      method: 'GET',
      onSuccess: (data) => data,
    })
      .catch((error: any) => error.message)

    const data = await abortRequest

    expect(data).toBe(message)
    expect(fetchMock.mock.calls.length).toBe(1)
  })

  it('success chain', async () => {
    mockResponse(JSON.stringify({ data: 'response data' }))

    const catchCallback = vi.fn()
    const finallyCallback = vi.fn()
    const onSuccessCallback = vi.fn()
    const thenErrorCallback = vi.fn()
    const thenSuccessCallback = vi.fn()

    const abortRequest = new AbortRequest(url, {
      method: 'GET',
      onSuccess: onSuccessCallback,
    })
      .then(thenSuccessCallback, thenErrorCallback)
      .catch(catchCallback)
      .finally(finallyCallback)

    await abortRequest

    expect(finallyCallback).toHaveBeenCalled()
    expect(onSuccessCallback).toHaveBeenCalled()
    expect(thenSuccessCallback).toHaveBeenCalled()
    expect(thenErrorCallback).not.toHaveBeenCalled()
    expect(catchCallback).not.toHaveBeenCalled()
  })

  it('failure chain', async () => {
    mockReject(new Error('Request failed'))

    const catchCallback = vi.fn()
    const finallyCallback = vi.fn()
    const onSuccessCallback = vi.fn()
    const thenErrorCallback = vi.fn()
    const thenSuccessCallback = vi.fn()

    thenErrorCallback.mockImplementation(() => Promise.reject())

    const abortRequest = new AbortRequest(url, {
      method: 'GET',
      onSuccess: onSuccessCallback,
    })
      .then(thenSuccessCallback, thenErrorCallback)
      .catch(catchCallback)
      .finally(finallyCallback)

    await abortRequest

    expect(finallyCallback).toHaveBeenCalled()
    expect(onSuccessCallback).not.toHaveBeenCalled()
    expect(thenSuccessCallback).not.toHaveBeenCalled()
    expect(thenErrorCallback).toHaveBeenCalled()
    expect(catchCallback).toHaveBeenCalled()
  })

  it('calls onError once', async () => {
    mockReject(new Error('Request failed'))

    const onError = vi.fn((error: Error) => Promise.reject(error))

    const abortRequest = new AbortRequest(url, {
      method: 'GET',
      onError,
    })

    await expect(abortRequest).rejects.toThrow('Request failed')
    expect(onError).toHaveBeenCalledTimes(1)
  })

  describe('subgraph indexing errors', () => {
    const data = { vaults: [] }
    const indexingErrors = [ { message: 'indexing_error' } ]

    const createRequest = (subgraphError: 'allow' | 'deny', onSubgraphError = vi.fn()) => (
      new AbortRequest(url, {
        method: 'POST',
        body: `indexingErrors_${subgraphError}`,
        subgraphError,
        onSubgraphError,
      })
    )

    it('returns data and notifies for allow policy', async () => {
      mockResponse(JSON.stringify({ data, errors: indexingErrors }))

      const onSubgraphError = vi.fn()
      const result = await createRequest('allow', onSubgraphError)

      expect(result).toEqual(data)
      expect(onSubgraphError).toHaveBeenCalledTimes(1)
      expect(onSubgraphError).toHaveBeenCalledWith({ errors: indexingErrors, isAllowed: true })
    })

    it('rejects and notifies for deny policy', async () => {
      mockResponse(JSON.stringify({ errors: indexingErrors }))

      const onSubgraphError = vi.fn()

      await expect(createRequest('deny', onSubgraphError)).rejects.toThrow('indexing_error')
      expect(onSubgraphError).toHaveBeenCalledWith({ errors: indexingErrors, isAllowed: false })
    })

    it('rejects allow policy without data', async () => {
      mockResponse(JSON.stringify({ errors: indexingErrors }))

      const onSubgraphError = vi.fn()

      await expect(createRequest('allow', onSubgraphError)).rejects.toThrow('indexing_error')
      expect(onSubgraphError).toHaveBeenCalledWith({ errors: indexingErrors, isAllowed: false })
    })

    it('returns data with _meta.hasIndexingErrors for allow policy', async () => {
      const metaData = { ...data, _meta: { hasIndexingErrors: true } }

      mockResponse(JSON.stringify({ data: metaData }))

      const onSubgraphError = vi.fn()
      const result = await createRequest('allow', onSubgraphError)

      expect(result).toEqual(metaData)
      expect(onSubgraphError).toHaveBeenCalledWith({ errors: indexingErrors, isAllowed: true })
    })

    it('rejects other errors for allow policy', async () => {
      mockResponse(JSON.stringify({ data, errors: [ { message: 'Some error' } ] }))

      const onSubgraphError = vi.fn()

      await expect(createRequest('allow', onSubgraphError)).rejects.toThrow('Some error')
      expect(onSubgraphError).not.toHaveBeenCalled()
    })

    it('ignores errors in onSubgraphError', async () => {
      mockResponse(JSON.stringify({ data, errors: indexingErrors }))

      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      const onSubgraphError = vi.fn(() => {
        throw new Error('Handler error')
      })

      const result = await createRequest('allow', onSubgraphError)

      expect(result).toEqual(data)
      expect(consoleError).toHaveBeenCalled()

      consoleError.mockRestore()
    })

    it('notifies once for deduplicated requests', async () => {
      mockResponse(JSON.stringify({ data, errors: indexingErrors }))

      const onSubgraphError = vi.fn()

      await Promise.all([
        createRequest('allow', onSubgraphError),
        createRequest('allow', onSubgraphError),
      ])

      expect(onSubgraphError).toHaveBeenCalledTimes(1)
      expect(fetchMock.mock.calls.length).toBe(1)
    })
  })
})
