import ContractError from './ContractError'


type Type = 'gas' | 'transaction'

const texts: Record<Type, string> = {
  transaction: 'transaction call failed',
  gas: 'estimate gas failed',
}

const wrapErrorHandler = async <T extends unknown>(promise: Promise<T>, type: Type): Promise<T> => {
  try {
    const response = await promise

    return response
  }
  catch (error: any) {
    const contactError = new ContractError(error, texts[type])

    return Promise.reject(contactError)
  }
}


export default wrapErrorHandler
