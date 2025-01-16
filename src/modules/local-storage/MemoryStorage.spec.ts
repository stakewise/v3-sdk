import MemoryStorage from './MemoryStorage'


describe('MemoryStorage', () => {

  it('should write and read values', () => {
    const storage = new MemoryStorage()

    storage.setItem('key1', 'value1')
    storage.setItem('key2', 'value2')

    expect(storage.getItem('key1')).toEqual('value1')
    expect(storage.getItem('key2')).toEqual('value2')
  })

  it('should overwrite values', () => {
    const storage = new MemoryStorage()

    storage.setItem('key', 'value1')

    expect(storage.getItem('key')).toEqual('value1')

    storage.setItem('key', 'value2')

    expect(storage.getItem('key')).toEqual('value2')
  })

  it('should remove and clear', () => {
    const storage = new MemoryStorage()

    storage.setItem('key1', 'value1')
    storage.setItem('key2', 'value2')
    storage.removeItem('key2')

    expect(storage.getItem('key1')).toEqual('value1')
    expect(storage.getItem('key2')).toBeNull()

    storage.clear()

    expect(storage.length).toEqual(0)
  })

  it('should return null for undefined values', () => {
    const storage = new MemoryStorage()

    expect(storage.getItem('key')).toBeNull()
  })

  it('should return null for undefined keys', () => {
    const storage = new MemoryStorage()

    expect(storage.key(1)).toBeNull()
  })

  it('should return correct length', () => {
    const storage = new MemoryStorage()

    storage.setItem('key1', 'value1')

    expect(storage.length).toEqual(1)

    storage.setItem('key2', 'value2')

    expect(storage.length).toEqual(2)
  })
})
