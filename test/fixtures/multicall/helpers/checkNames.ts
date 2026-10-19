import { expect } from 'vitest'
import type { BaseContract } from 'ethers'

import decodeCalls from '../../../decodeCalls'
import decodeTransaction from '../../../decodeTransaction'


const checkNames = (contract: BaseContract, data: string, names: string[]) => {
  const { name: transactionName } = decodeTransaction(contract, data)
  const callNames = decodeCalls(contract, data).map(({ name }) => name)

  expect(transactionName).toBe(names.length === 1 ? names[0] : 'multicall')
  expect(callNames).toEqual(names)
}


export default checkNames
