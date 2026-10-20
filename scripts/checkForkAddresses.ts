import configs from '../src/helpers/configs'
import { getSnapshot } from '../test/fork/snapshots'
import collectAddresses from '../test/fork/collectAddresses'
import { forkNetworks, getForkNetworkName } from '../test/fork/constants'
import type { ForkNetwork } from '../test/fork/constants'


type GetCodeInput = {
  rpcUrl: string
  block: number
  address: string
}

type RpcResponse = {
  result?: unknown
  error?: { code: number, message: string }
}

const hint = 'перезакрепи блок (вики stakewise/v3-sdk, „Как обновить снимок форк-тестов“) или проверь адрес'

const supportedNetworks = Object.keys(forkNetworks).map(Number) as ForkNetwork[]
const supportedNames = supportedNetworks.map(getForkNetworkName)

const parseNetwork = (name: string) => {
  const network = supportedNetworks.find((item) => getForkNetworkName(item) === name)

  if (!network) {
    throw new Error(`Unknown network "${name}", expected one of: ${supportedNames.join(', ')}`)
  }

  return network
}

const getRpcUrl = (network: ForkNetwork) => {
  const { rpcEnv } = forkNetworks[network]
  const rpcUrl = process.env[rpcEnv]

  if (!rpcUrl) {
    throw new Error(`${rpcEnv} is required`)
  }

  return rpcUrl
}

const getCode = async ({ rpcUrl, address, block }: GetCodeInput) => {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getCode',
      params: [ address, `0x${block.toString(16)}` ],
    }),
  }).catch(() => {
    throw new Error('RPC request failed')
  })

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

  if (!failures.length) {
    console.log(`${name}: ${addresses.length} addresses have a contract at block ${block}`)
  }

  return failures
}

const main = async (names: string[]) => {
  if (!names.length) {
    throw new Error(`Pass at least one network: ${supportedNames.join(', ')}`)
  }

  const networks = names.map(parseNetwork)

  networks.forEach(getRpcUrl)

  const failures: string[] = []

  for (const network of networks) {
    failures.push(...await findEmptyAddresses(network))
  }

  if (failures.length) {
    console.error([ ...failures, hint ].join('\n'))
    process.exitCode = 1
  }
}


main(process.argv.slice(2)).catch((error: Error) => {
  console.error(error.message)
  process.exitCode = 1
})
