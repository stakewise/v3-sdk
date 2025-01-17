import fetchMock from 'jest-fetch-mock'

import AbortRequest from './abortRequest'


beforeEach(() => {
  fetchMock.enableMocks()
})

afterEach(() => {
  fetchMock.resetMocks()
})

describe('AbortRequest', () => {
  it('resolves the request', async () => {
    const mock = 'response data'
    fetchMock.mockResponse(JSON.stringify({ data: mock }))

    const abortRequest = new AbortRequest('https://example.com', {
      method: 'GET',
      onSuccess: (data) => data,
    })

    const result = await abortRequest

    expect(result).toEqual(mock)
    expect(fetchMock.mock.calls.length).toBe(1)
  })

  it('resolves modified data', async () => {
    const mock = { test: 'response data' }
    fetchMock.mockResponse(JSON.stringify({ data: mock }))

    const abortRequest = new AbortRequest<{ test: string }, string>('https://example.com', {
      method: 'GET',
      onSuccess: (data) => data.test,
    })

    const result = await abortRequest

    expect(result).toEqual(mock.test)
    expect(fetchMock.mock.calls.length).toBe(1)
  })

  it('rejects the request', async () => {
    fetchMock.mockReject(new Error('Request failed'))

    const abortRequest = new AbortRequest('https://example.com', {
      method: 'GET',
      onSuccess: (data) => data,
    })

    await expect(abortRequest).rejects.toThrow('Request failed')
    expect(fetchMock.mock.calls.length).toBe(1)
  })

  it('aborts the request', async () => {
    fetchMock.mockResponse(JSON.stringify({ data: 'response data' }))

    const abortRequest = new AbortRequest('https://example.com', {
      method: 'GET',
      onSuccess: (data) => data,
    })

    abortRequest.abort()

    const [ url, requestInit ] = fetchMock.mock.calls[0]

    expect(requestInit?.signal?.aborted).toEqual(true)
    expect(fetchMock.mock.calls.length).toBe(1)
  })

  it('handles multiple requests for the same body', async () => {
    const mock = 'response data'

    fetchMock.mockResponse(JSON.stringify({ data: mock }))

    const url = 'https://example.com'
    const options = {
      method: 'POST',
      body: 'sameBody',
      onSuccess: (data: string) => data,
    }

    const abortRequest1 = new AbortRequest(url, options)
    const abortRequest2 = new AbortRequest(url, options)

    expect(abortRequest1.request).toBe(abortRequest2.request)

    const [ result1, result2 ] = await Promise.all([
      abortRequest1,
      abortRequest2,
    ])

    expect(result1).toEqual(mock)
    expect(result2).toEqual(mock)
    expect(fetchMock.mock.calls.length).toBe(1)
  })

  it('resolves the non-aborted request when multiple requests with the same body', async () => {
    const mock = 'response data'

    fetchMock.mockResponse(JSON.stringify({ data: mock }))

    const url = 'https://example.com'
    const options = {
      method: 'POST',
      body: 'sameBody',
      onSuccess: (data: string) => data,
    }

    const abortRequest1 = new AbortRequest(url, options)
    const abortRequest2 = new AbortRequest(url, options)

    abortRequest1.abort()

    const result = await abortRequest2

    expect(result).toEqual(mock)
    expect(fetchMock.mock.calls.length).toBe(1)
  })

  it('has "abort" method after "then", "catch" and "finally" methods', async () => {
    const mock = 'response data'

    fetchMock.mockResponse(JSON.stringify({ data: mock }))

    const catchCallback = jest.fn()
    const finallyCallback = jest.fn()
    const onSuccessCallback = jest.fn()
    const thenErrorCallback = jest.fn()
    const thenSuccessCallback = jest.fn()

    const initialRequest = new AbortRequest('https://example.com', {
      method: 'POST',
      body: 'sameBody',
      onSuccess: onSuccessCallback,
    })
    const abortRequest = initialRequest
      .then(thenSuccessCallback, thenErrorCallback)
      .catch(catchCallback)
      .finally(finallyCallback)

    abortRequest.abort()

    const [ url, requestInit ] = fetchMock.mock.calls[0]

    expect(requestInit?.signal?.aborted).toEqual(true)
    expect(fetchMock.mock.calls.length).toBe(1)
    expect(thenSuccessCallback).not.toHaveBeenCalled()
    expect(thenErrorCallback).not.toHaveBeenCalled()
    expect(catchCallback).not.toHaveBeenCalled()
    expect(finallyCallback).not.toHaveBeenCalled()
    expect(onSuccessCallback).not.toHaveBeenCalled()
  })

  it('rejects the error in "catch" method', async () => {
    const error = 'Request failed'
    fetchMock.mockReject(new Error(error))

    const abortRequest = new AbortRequest('https://example.com', {
      method: 'GET',
      onSuccess: (data) => data,
    })
      .catch((error: any) => error.message)

    const data = await abortRequest

    await expect(data).toBe(error)
    expect(fetchMock.mock.calls.length).toBe(1)
  })

  it('calls methods if promise is successful', async () => {
    fetchMock.mockResponse(JSON.stringify({ data: 'response data' }))

    const catchCallback = jest.fn()
    const finallyCallback = jest.fn()
    const onSuccessCallback = jest.fn()
    const thenErrorCallback = jest.fn()
    const thenSuccessCallback = jest.fn()

    const abortRequest = new AbortRequest('https://example.com', {
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

  it('calls methods if promise is not successful', async () => {
    fetchMock.mockReject(new Error('Request failed'))

    const catchCallback = jest.fn()
    const finallyCallback = jest.fn()
    const onSuccessCallback = jest.fn()
    const thenSuccessCallback = jest.fn()
    const thenErrorCallback = jest.fn()

    thenErrorCallback.mockImplementation(() => Promise.reject())

    const abortRequest = new AbortRequest('https://example.com', {
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
})
