import { ZeroAddress } from 'ethers'


export type AddressTree = {
  readonly [key: string]: string | AddressTree
}

export type CollectedAddress = {
  key: string
  address: string
}

const collectAddresses = (addresses: AddressTree, prefix = ''): CollectedAddress[] => {
  return Object.entries(addresses).flatMap(([ name, value ]) => {
    const key = prefix ? `${prefix}.${name}` : name

    if (typeof value === 'string') {
      return value === ZeroAddress ? [] : [ { key, address: value } ]
    }

    return collectAddresses(value, key)
  })
}


export default collectAddresses
