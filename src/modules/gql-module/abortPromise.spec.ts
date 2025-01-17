import AbortPromise from './abortPromise'
import AbortCallback from './abortCallback'


describe('AbortPromise', () => {

  it('resolves the promise', async () => {
    const mock = 'response data'
    const abortPromise = new AbortPromise((resolve) => {
      resolve(mock)
    })

    const result = await abortPromise

    expect(result).toEqual(mock)
  })

  it('rejects the promise', async () => {
    const mock = 'error'
    const abortPromise = new AbortPromise((resolve, reject) => {
      reject(mock)
    })

    await expect(abortPromise).rejects.toEqual(mock)
  })

  it('calls then on promise resolve', async () => {
    const mockThenFn = jest.fn()
    const mockCatchFn = jest.fn()

    const abortPromise = new AbortPromise((resolve, reject) => {
      resolve(null)
    })
      .then(mockThenFn, mockCatchFn)

    await abortPromise

    expect(mockThenFn).toBeCalledTimes(1)
    expect(mockCatchFn).toBeCalledTimes(0)
  })

  it('calls catch on promise reject', async () => {
    const mockThenFn = jest.fn()
    const mockCatchFn = jest.fn()

    const abortPromise = new AbortPromise((resolve, reject) => {
      reject(null)
    })
      .then(mockThenFn, mockCatchFn)

    await abortPromise

    expect(mockThenFn).toBeCalledTimes(0)
    expect(mockCatchFn).toBeCalledTimes(1)
  })

  it('doesn\'t resolve aborted promise', async () => {
    const mockThenFn = jest.fn()
    const mockCatchFn = jest.fn()

    const abortPromise = new AbortPromise((resolve, reject) => {
      resolve(null)
    })
      .then(mockThenFn, mockCatchFn)

    abortPromise.abort()

    expect(mockThenFn).toBeCalledTimes(0)
    expect(mockCatchFn).toBeCalledTimes(0)
  })

  it('doesn\'t reject aborted promise', async () => {
    const mockThenFn = jest.fn()
    const mockCatchFn = jest.fn()

    const abortPromise = new AbortPromise((resolve, reject) => {
      reject(null)
    })
      .then(mockThenFn, mockCatchFn)

    abortPromise.abort()

    expect(mockThenFn).toBeCalledTimes(0)
    expect(mockCatchFn).toBeCalledTimes(0)
  })

  it('resolves multiple promises in "all" method', async () => {
    const mock1 = 'response data 1'
    const mock2 = 'response data 2'

    const promise1 = new Promise((resolve) => resolve(mock1))
    const promise2 = new Promise((resolve) => resolve(mock2))

    const result = await AbortPromise.all([ promise1, promise2 ])

    expect(result).toEqual([ mock1, mock2 ])
  })

  it('resolves promise in "race" method', async () => {
    const mock = 'response data'

    const promise1 = new Promise((resolve) => resolve(mock))
    const promise2 = new Promise(() => {})

    const result = await AbortPromise.race([ promise1, promise2 ])

    expect(result).toEqual(mock)
  })

  it('resolves multiple abort promises in "all" method', async () => {
    const mock1 = 'response data 1'
    const mock2 = 'response data 2'

    const promise1 = new AbortPromise((resolve) => resolve(mock1))
    const promise2 = new AbortPromise((resolve) => resolve(mock2))

    const result = await AbortPromise.all([ promise1, promise2 ])

    expect(result).toEqual([ mock1, mock2 ])
  })

  it('doesn\'t resolve multiple promises in "all" method on abort', async () => {
    const abort1 = jest.fn()
    const abort2 = jest.fn()
    const mockThenFn = jest.fn()
    const mockCatchFn = jest.fn()

    const dummyPromise = new Promise(() => {})

    const promise1 = new AbortCallback(dummyPromise, abort1)
    const promise2 = new AbortCallback(dummyPromise, abort2)

    // @ts-ignore
    const promise = AbortPromise.all([ promise1, promise2 ])
      .then(mockThenFn, mockCatchFn)

    promise.abort()

    expect(abort1).toBeCalledTimes(1)
    expect(abort2).toBeCalledTimes(1)
    expect(mockThenFn).toBeCalledTimes(0)
    expect(mockCatchFn).toBeCalledTimes(0)
  })

  it('doesn\'t reject multiple promises in "all" method on abort', async () => {
    const mockThenFn = jest.fn()
    const mockCatchFn = jest.fn()

    const promise = AbortPromise.all([ Promise.reject(), Promise.reject() ])
      .then(mockThenFn, mockCatchFn)

    promise.abort()

    expect(mockThenFn).toBeCalledTimes(0)
    expect(mockCatchFn).toBeCalledTimes(0)
  })
})
