import configs from '../src/helpers/configs'
import getCode from '../test/fork/getCode'
import { getSnapshot } from '../test/fork/snapshots'
import type { ForkNetwork } from '../test/fork/constants'
import collectAddresses from '../test/fork/collectAddresses'
import { forkNetworks, getForkNetworkName } from '../test/fork/constants'
import parseForkNetwork, { forkNetworkNames } from '../test/fork/parseForkNetwork'


const getHint = (names: string[]) => `Run: ${names.map((name) => `pnpm fork:snapshot ${name}`).join(' && ')}`

const getRpcUrl = (network: ForkNetwork) => {
  const { rpcEnv } = forkNetworks[network]
  const rpcUrl = process.env[rpcEnv]

  if (!rpcUrl) {
    throw new Error(`${rpcEnv} is required`)
  }

  return rpcUrl
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
    throw new Error(`Pass at least one network: ${forkNetworkNames.join(', ')}`)
  }

  const networks = names.map(parseForkNetwork)

  networks.forEach(getRpcUrl)

  const failures: string[] = []
  const failedNames: string[] = []

  for (const network of networks) {
    const networkFailures = await findEmptyAddresses(network)

    if (networkFailures.length) {
      failures.push(...networkFailures)
      failedNames.push(getForkNetworkName(network))
    }
  }

  if (failures.length) {
    console.error([ ...failures, getHint(failedNames) ].join('\n'))
    process.exitCode = 1
  }
}


main(process.argv.slice(2)).catch((error: Error) => {
  console.error(error.message)
  process.exitCode = 1
})
