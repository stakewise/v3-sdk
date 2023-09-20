import BigDecimals from 'bignumber.js'


// ATTN BigDecimals is module for more accurate floating point calculations

type Argument = bigint | string | number

const toBigDecimal = (value: Argument) => {
  if (typeof value === 'string') {
    return new BigDecimals(value)
  }

  if (typeof value === 'number' && !isNaN(value)) {
    return new BigDecimals(String(value))
  }

  if (typeof value === 'bigint') {
    return new BigDecimals(value.toString())
  }

  throw new Error(`toBigDecimal did not recognize the value: ${value}`)
}

class BigDecimal {
  #value: BigDecimals

  constructor(value: Argument) {
    this.#value = toBigDecimal(value)
  }

  divide(value: Argument) {
    const formattedValue = toBigDecimal(value)
    this.#value = this.#value.dividedBy(formattedValue)

    return this
  }

  multiply(value: Argument) {
    const formattedValue = toBigDecimal(value)
    this.#value = this.#value.multipliedBy(formattedValue)

    return this
  }

  minus(value: Argument) {
    const formattedValue = toBigDecimal(value)
    this.#value = this.#value.minus(formattedValue)

    return this
  }

  plus(value: Argument) {
    const formattedValue = toBigDecimal(value)
    this.#value = this.#value.plus(formattedValue)

    return this
  }

  decimals(count: number) {
    this.#value = this.#value.decimalPlaces(count, 1)

    return this
  }

  // TODO remove ?
  gt(value: number) {
    return this.#value.gt(value)
  }

  toString() {
    return String(this.#value)
  }
}


export default BigDecimal
