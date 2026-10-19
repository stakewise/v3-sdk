import type { BaseContract, TransactionDescription } from 'ethers'

import decodeTransaction from './decodeTransaction'


const decodeCalls = (contract: BaseContract, data: string): TransactionDescription[] => {
  const transaction = decodeTransaction(contract, data)

  if (transaction.name === 'multicall') {
    return transaction.args[0].map((callData: string) => decodeTransaction(contract, callData))
  }

  return [ transaction ]
}


export default decodeCalls
