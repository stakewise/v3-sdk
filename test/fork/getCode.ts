import wait from '../wait'


type GetCodeInput = {
  rpcUrl: string
  block: number
  address: string
}

type RpcResponse = {
  result?: unknown
  error?: { code: number, message: string }
}

const maxAttempts = 5
const retryDelay = 1000
const tooManyRequests = 429

const getCode = async (input: GetCodeInput, attempt = 1): Promise<string> => {
  const { rpcUrl, address, block } = input
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getCode',
      params: [ address, `0x${block.toString(16)}` ],
    }),
  })
    .catch(() => {
      throw new Error('RPC request failed')
    })

  if (response.status === tooManyRequests && attempt < maxAttempts) {
    await wait(retryDelay * attempt)

    return getCode(input, attempt + 1)
  }

  if (!response.ok) {
    throw new Error(`RPC responded with HTTP ${response.status}`)
  }

  const { result, error }: RpcResponse = await response.json()

  if (error) {
    throw new Error(`RPC error ${error.code}: ${error.message.replaceAll(rpcUrl, '<rpc url>')}`)
  }

  if (typeof result !== 'string') {
    throw new Error('RPC returned no code')
  }

  return result
}


export default getCode
