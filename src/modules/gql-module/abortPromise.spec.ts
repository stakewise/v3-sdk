import { describe, expect, vi } from 'vitest'

import { it, wait } from '../../../test'

import AbortPromise from './abortPromise'
import AbortCallback from './abortCallback'


const first = 'response data 1'
const second = 'response data 2'

const settleCases = [
  {
    name: 'then on resolve',
    create: () => new AbortPromise((resolve) => resolve(null)),
    thenCalls: 1,
    catchCalls: 0,
  },
  {
    name: 'catch on reject',
    create: () => new AbortPromise((resolve, reject) => reject(null)),
    thenCalls: 0,
    catchCalls: 1,
  },
]

const resolveCases = [
  {
    name: 'all promises',
    create: () => AbortPromise.all([
      new Promise((resolve) => resolve(first)),
      new Promise((resolve) => resolve(second)),
    ]),
    expected: [ first, second ],
  },
  {
    name: 'race',
    create: () => AbortPromise.race([
      new Promise((resolve) => resolve(first)),
      new Promise(() => {}),
    ]),
    expected: first,
  },
  {
    name: 'all abort promises',
    create: () => AbortPromise.all([
      new AbortPromise((resolve) => resolve(first)),
      new AbortPromise((resolve) => resolve(second)),
    ]),
    expected: [ first, second ],
  },
]

const abortCases = [
  {
    name: 'resolve',
    create: () => new AbortPromise((resolve) => resolve(null)),
  },
  {
    name: 'reject',
    create: () => new AbortPromise((resolve, reject) => reject(null)),
  },
  {
    name: 'all resolve',
    create: () => AbortPromise.all([ Promise.resolve(1), Promise.resolve(2) ]),
  },
  {
    name: 'all reject',
    create: () => AbortPromise.all([ Promise.reject(), Promise.reject() ]),
  },
  {
    name: 'race resolve',
    create: () => AbortPromise.race([ Promise.resolve(1), Promise.resolve(2) ]),
  },
  {
    name: 'race reject',
    create: () => AbortPromise.race([ Promise.reject(), Promise.reject() ]),
  },
]

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

  it.for(settleCases)('$name', async ({ create, thenCalls, catchCalls }) => {
    const mockThenFn = vi.fn()
    const mockCatchFn = vi.fn()

    const abortPromise = create().then(mockThenFn, mockCatchFn)

    await abortPromise

    expect(mockThenFn).toHaveBeenCalledTimes(thenCalls)
    expect(mockCatchFn).toHaveBeenCalledTimes(catchCalls)
  })

  it.for(resolveCases)('$name', async ({ create, expected }) => {
    const result = await create()

    expect(result).toEqual(expected)
  })

  it.for(abortCases)('abort $name', async ({ create }) => {
    const mockThenFn = vi.fn()
    const mockCatchFn = vi.fn()

    const abortPromise = create().then(mockThenFn, mockCatchFn)

    abortPromise.abort()

    await wait()

    expect(mockThenFn).toHaveBeenCalledTimes(0)
    expect(mockCatchFn).toHaveBeenCalledTimes(0)
  })

  it('abort all callbacks', async () => {
    const abort1 = vi.fn()
    const abort2 = vi.fn()
    const mockThenFn = vi.fn()
    const mockCatchFn = vi.fn()

    const dummyPromise = new Promise(() => {})

    const promise1 = new AbortCallback(dummyPromise, abort1)
    const promise2 = new AbortCallback(dummyPromise, abort2)
    const promises = [ promise1, promise2 ] as unknown as Promise<unknown>[]

    const promise = AbortPromise.all(promises).then(mockThenFn, mockCatchFn)

    promise.abort()

    await wait()

    expect(abort1).toHaveBeenCalledTimes(1)
    expect(abort2).toHaveBeenCalledTimes(1)
    expect(mockThenFn).toHaveBeenCalledTimes(0)
    expect(mockCatchFn).toHaveBeenCalledTimes(0)
  })
})
