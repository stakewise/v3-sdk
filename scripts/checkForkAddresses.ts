import { ZeroAddress } from 'ethers'

import wait from '../test/wait'
import configs from '../src/helpers/configs'
import { getSnapshot } from '../test/fork/snapshots'
import type { ForkNetwork } from '../test/fork/constants'
import { forkNetworks, getForkNetworkName } from '../test/fork/constants'
import parseForkNetwork, { forkNetworkNames } from '../test/fork/parseForkNetwork'


type AddressTree = {
  readonly [key: string]: string | AddressTree
}

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

const collectAddresses = (addresses: AddressTree, prefix = ''): Array<{ key: string, address: string }> => (
  Object.entries(addresses).flatMap(([ name, value ]) => {
    const key = prefix ? `${prefix}.${name}` : name

    if (typeof value === 'string') {
      return value === ZeroAddress ? [] : [ { key, address: value } ]
    }

    return collectAddresses(value, key)
  })
)

const getRpcUrl = (network: ForkNetwork) => {
  const { rpcEnv } = forkNetworks[network]
  const rpcUrl = process.env[rpcEnv]

  if (!rpcUrl) {
    throw new Error(`${rpcEnv} is required`)
  }

  return rpcUrl
}

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

const findEmptyAddresses = async (network: ForkNetwork) => {
  const name = getForkNetworkName(network)
  const rpcUrl = getRpcUrl(network)
  const { block } = getSnapshot(network)
  const addresses = collectAddresses(configs[network].addresses)
  const failures: string[] = []

  for (const { key, address } of addresses) {
    const code = await getCode({ rpcUrl, address, block })

    if (code === '0x') {
      failures.push(`${name} ${key} ${address}: no contract at block ${block}`)
    }
  }

  if (failures.length) {
    failures.push(`Run: pnpm fork:snapshot ${name}`)
  }
  else {
    console.log(`${name}: ${addresses.length} addresses have a contract at block ${block}`)
  }

  return failures
}

const main = async (names: string[]) => {
  if (!names.length) {
    throw new Error(`Pass at least one network: ${forkNetworkNames.join(', ')}`)
  }

  const networks = names.map(parseForkNetwork)

  networks.forEach(getRpcUrl)

  const failures: string[] = []

  for (const network of networks) {
    failures.push(...await findEmptyAddresses(network))
  }

  if (failures.length) {
    console.error(failures.join('\n'))
    process.exitCode = 1
  }
}


main(process.argv.slice(2)).catch((error: Error) => {
  console.error(error.message)
  process.exitCode = 1
})
