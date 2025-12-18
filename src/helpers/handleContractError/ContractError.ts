import { Interface } from 'ethers'

import ErrorsAbi from './ErrorsAbi.json'


type Tx = {
  from?: string
  to?: string
  data?: string
}

interface OriginalError extends Error {
  info?: { error: { data: string } }
  error?: { data: string }
  transaction: Tx
  data: string
}

class ContractError extends Error {
  constructor(error: OriginalError, prefix?: string) {
    let name = error?.name || ''
    let message = error?.message || ''

    const data = (
      error?.data
      || error?.error?.data
      || error?.info?.error?.data
    )

    if (data) {
      try {
        const iface = new Interface(ErrorsAbi)
        const result = iface.parseError(data)

        if (result?.name) {
          name = result.name
          message = `[${prefix || 'operation failed'}]:`

          const transaction = error?.transaction

          if (typeof transaction === 'object') {
            const data = {
              solidityError: name,
              to: transaction.to,
              from: transaction.from,
              data: transaction.data,
            }

            message = `${message} ${JSON.stringify(data, null, '\t')}`
          }
        }
      }
      // eslint-disable-next-line no-empty
      catch {}
    }

    super(message)
    this.name = name
    this.stack = error.stack
    this.cause = error.cause
  }
}


export default ContractError
