import { isAddress } from 'ethers'


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


export default {
  bigint,
  string,
  number,
  address,
}
