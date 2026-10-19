import type { BaseContract, TransactionDescription } from 'ethers'


const decodeTransaction = (contract: BaseContract, data: string): TransactionDescription => {
  const transaction = contract.interface.parseTransaction({ data })

  if (!transaction) {
    throw new Error(`Unknown calldata for ${contract.target}`)
  }

  return transaction
}


export default decodeTransaction
