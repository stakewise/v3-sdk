import type { EncodedList, EncodedTransaction } from './types'


const getListTransactions = <Encoded extends EncodedList>(encoded: Encoded, order: Array<keyof Encoded>) => {
  const transactions: EncodedTransaction[] = []

  order.forEach((key) => {
    const transaction = encoded[key]

    if (transaction) {
      transactions.push(transaction)
    }
  })

  return transactions
}


export default getListTransactions
