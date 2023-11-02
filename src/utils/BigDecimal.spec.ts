import BigDecimal from './BigDecimal'


describe('BigDecimal', () => {

  it('should initialize correctly from string', () => {
    const value = '123.45'
    const decimal = new BigDecimal(value)
    expect(decimal.toString()).toBe(value)
  })

  it('should initialize correctly from number', () => {
    const value = 123.45
    const decimal = new BigDecimal(value)
    expect(decimal.toString()).toBe(String(value))
  })

  it('should initialize correctly from bigint', () => {
    const value = BigInt('12345')
    const decimal = new BigDecimal(value)
    expect(decimal.toString()).toBe('12345')
  })

  it('should throw an error for invalid inputs', () => {
    expect(() => new BigDecimal(NaN)).toThrow()
  })

  it('should correctly divide values', () => {
    const decimal = new BigDecimal(100)
    decimal.divide(2)
    expect(decimal.toString()).toBe('50')
  })

  it('should correctly multiply values', () => {
    const decimal = new BigDecimal('100.5')
    decimal.multiply(2)
    expect(decimal.toString()).toBe('201')
  })

  it('should correctly subtract values', () => {
    const decimal = new BigDecimal(100)
    decimal.minus(25.5)
    expect(decimal.toString()).toBe('74.5')
  })

  it('should correctly add values', () => {
    const decimal = new BigDecimal(100)
    decimal.plus(25.5)
    expect(decimal.toString()).toBe('125.5')
  })
})
