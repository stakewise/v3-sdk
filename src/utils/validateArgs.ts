import { isAddress } from 'ethers'


const image = (value: string) => {
  const decode = value?.substring(value.indexOf(',') + 1)
  const sizeMB = decode ? atob(decode).length / 1000 / 1000 : 0

  if (sizeMB > 1) {
    const currentSize = sizeMB.toFixed(2)

    throw new Error(`The size of the image must be under 1 MB, current size is ${currentSize} MB`)
  }
}

const bigint = (values: Record<string, bigint>) => {
  Object.keys(values).forEach((key) => {
    if (typeof values[key] !== 'bigint') {
      throw new Error(`The "${key}" argument must be of type bigint`)
    }
  })
}

const address = (values: Record<string, string>) => {
  Object.keys(values).forEach((key) => {
    if (!isAddress(values[key])) {
      throw new Error(`The "${key}" argument must be a valid address`)
    }
  })
}

const string = (values: Record<string, string>) => {
  Object.keys(values).forEach((key) => {
    if (typeof values[key] !== 'string') {
      throw new Error(`The "${key}" argument must be a string`)
    }
  })
}

const number = (values: Record<string, number>) => {
  Object.keys(values).forEach((key) => {
    if (typeof values[key] !== 'number') {
      throw new Error(`The "${key}" argument must be a number`)
    }
  })
}

const array = (values: Record<string, any[]>, withEmptyCheck: boolean = true) => {
  Object.keys(values).forEach((key) => {
    if (!Array.isArray(values[key])) {
      throw new Error(`The "${key}" argument must be an array`)
    }
    if (withEmptyCheck && !values[key].length) {
      throw new Error(`The "${key}" argument is an empty array`)
    }
  })
}

const maxLength = (values: Record<string, { value: string, length: number }>) => {
  Object.keys(values).forEach((key) => {
    const { value, length } = values[key]
    if (value.length > length) {
      throw new Error(`The value for "${key}" argument must be less than ${length} characters`)
    }
  })
}


export default {
  image,
  array,
  bigint,
  string,
  number,
  address,
  maxLength,
}
