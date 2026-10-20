import type { EncodedList, ListMethod } from '../fixtures/transaction/helpers'


const pickTransaction = <Input, Encoded extends EncodedList>(
  method: ListMethod<Input, Encoded>,
  key: keyof Encoded
) => {
  const encode = async (input: Input) => {
    const encoded = await method.encode(input)
    const otherKeys = Object.keys(encoded).filter((name) => name !== key && encoded[name])
    const transaction = encoded[key]

    if (otherKeys.length > 0 || !transaction) {
      throw new Error(`the scenario must send only ${String(key)}, got ${otherKeys.join(', ') || 'nothing'}`)
    }

    return transaction
  }

  const send = (input: Input) => method(input)

  return Object.assign(send, { encode, estimateGas: method.estimateGas })
}


export default pickTransaction
