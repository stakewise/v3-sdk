import { spawn } from 'node:child_process'

import wait from '../wait'
import { getSnapshot } from './snapshots'
import { activeForkNetworks, forkNetworks, getForkRpcUrl, getForkNetworkName } from './constants'
import type { ForkNetwork } from './constants'


type Stop = () => Promise<void>

type StartInput = {
  forkUrl: string
  network: ForkNetwork
}

const rpcRetries = 15
const rpcTimeoutMs = 30_000
const rpcRetryBackoffMs = 1_000

const checkIsAnvilReady = async (rpcUrl: string) => {
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_blockNumber',
        params: [],
      }),
    })

    return response.ok
  }
  catch {
    return false
  }
}

const getForkUrl = (network: ForkNetwork) => {
  const { rpcEnv } = forkNetworks[network]
  const forkUrl = process.env[rpcEnv]

  if (!forkUrl) {
    const name = getForkNetworkName(network)

    throw new Error(`${rpcEnv} is required for fork tests (archive access to the block in mocks/${name}.json)`)
  }

  return forkUrl
}

const launchAnvil = async ({ network, forkUrl }: StartInput): Promise<Stop> => {
  const { port, computeUnitsPerSecond } = forkNetworks[network]
  const { block } = getSnapshot(network)
  const rpcUrl = getForkRpcUrl(network)
  const rateLimitArgs = computeUnitsPerSecond ? [ '--compute-units-per-second', String(computeUnitsPerSecond) ] : []

  if (await checkIsAnvilReady(rpcUrl)) {
    throw new Error(`Port ${port} is busy - stop the node listening on it, fork tests start their own anvil`)
  }

  const anvil = spawn('anvil', [
    '--fork-url', forkUrl,
    '--fork-block-number', String(block),
    '--port', String(port),
    '--retries', String(rpcRetries),
    '--timeout', String(rpcTimeoutMs),
    '--fork-retry-backoff', String(rpcRetryBackoffMs),
    '--auto-impersonate',
    ...rateLimitArgs,
    '--silent',
  ], { stdio: [ 'ignore', 'inherit', 'pipe' ] })

  anvil.stderr?.on('data', (chunk) => {
    process.stderr.write(String(chunk).replaceAll(forkUrl, '<rpc url>'))
  })

  let failure: string | null = null

  anvil.on('error', (error) => {
    failure = `Cannot start anvil (install Foundry: https://getfoundry.sh): ${error}`
  })

  anvil.on('exit', (code) => {
    failure = failure || `anvil exited with code ${code} before it was ready`
  })

  const stop = () => new Promise<void>((resolve) => {
    if (anvil.exitCode !== null || anvil.signalCode !== null) {
      resolve()

      return
    }

    anvil.once('exit', () => resolve())
    anvil.kill()
  })

  for (let attempt = 0; attempt < 100; attempt++) {
    if (failure) {
      throw new Error(failure)
    }

    if (await checkIsAnvilReady(rpcUrl)) {
      return stop
    }

    await wait(300)
  }

  await stop()

  throw new Error(`anvil for ${getForkNetworkName(network)} did not start in 30 seconds`)
}

const startAnvil = async (input: StartInput): Promise<Stop> => {
  try {
    return await launchAnvil(input)
  }
  catch {
    return launchAnvil(input)
  }
}

const setup = async () => {
  const starts = activeForkNetworks.map((network) => ({ network, forkUrl: getForkUrl(network) }))
  const stops: Stop[] = []

  const stopAll = async () => {
    await Promise.all(stops.map((stop) => stop()))
  }

  try {
    for (const start of starts) {
      stops.push(await startAnvil(start))
    }
  }
  catch (error) {
    await stopAll()

    throw error
  }

  return stopAll
}


export default setup
