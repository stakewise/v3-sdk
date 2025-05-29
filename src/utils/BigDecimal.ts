import BigDecimals from 'bignumber.js'


type Argument = bigint | string | number | BigDecimal

/**
 * @private
 * @description This class can be modified without maintaining backward compatibility.
 */
class BigDecimal {
  #value: BigDecimals
  #decimalsCount: number = 18

  constructor(value: Argument) {
    this.#value = this.toBigDecimal(value)
  }

  toBigDecimal(value: Argument) {
    if (value instanceof BigDecimal) {
      return new BigDecimals(value.toString())
    }

    if (typeof value === 'string') {
      return new BigDecimals(value)
    }

    if (typeof value === 'number' && !isNaN(value)) {
      return new BigDecimals(String(value))
    }

    if (typeof value === 'bigint') {
      return new BigDecimals(value.toString())
    }

    throw new Error(`toBigDecimal did not recognize the value: ${value} ${typeof value}`)
  }

  divide(value: Argument) {
    const formattedValue = this.toBigDecimal(value)
    this.#value = this.#value.dividedBy(formattedValue)

    return this
  }

  multiply(value: Argument) {
    const formattedValue = this.toBigDecimal(value)
    this.#value = this.#value.multipliedBy(formattedValue)

    return this
  }

  minus(value: Argument) {
    const formattedValue = this.toBigDecimal(value)
    this.#value = this.#value.minus(formattedValue)

    return this
  }

  plus(value: Argument) {
    const formattedValue = this.toBigDecimal(value)
    this.#value = this.#value.plus(formattedValue)

    return this
  }

  decimals(count: number) {
    this.#value = this.#value.decimalPlaces(count, 1)
    this.#decimalsCount = count

    return this
  }

  toString() {
    return this.#value.toFixed(this.#decimalsCount)
  }

  toNumber() {
    return this.#value.toNumber()
  }
}


export default BigDecimal
