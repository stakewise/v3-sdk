import { describe, expect } from 'vitest'

import { it } from '../../../test'

import MemoryStorage from './MemoryStorage'


describe('MemoryStorage', () => {

  it('remove and clear', () => {
    const storage = new MemoryStorage()

    storage.setItem('key1', 'value1')
    storage.setItem('key2', 'value2')
    storage.removeItem('key2')

    const keptValue = storage.getItem('key1')
    const removedValue = storage.getItem('key2')

    expect(keptValue).toEqual('value1')
    expect(removedValue).toBeNull()

    storage.clear()

    expect(storage.length).toEqual(0)
  })

  it('overwrite', () => {
    const storage = new MemoryStorage()

    storage.setItem('key1', 'value1')
    storage.setItem('key1', 'value2')

    const value = storage.getItem('key1')

    expect(value).toBe('value2')
    expect(storage.length).toBe(1)
  })

  it('unknown key', () => {
    const storage = new MemoryStorage()

    const key = storage.key(1)

    expect(key).toBeNull()
  })

  it('length', () => {
    const storage = new MemoryStorage()

    storage.setItem('key1', 'value1')

    expect(storage.length).toEqual(1)

    storage.setItem('key2', 'value2')

    expect(storage.length).toEqual(2)
  })
})
