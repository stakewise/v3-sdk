import { spawn } from 'node:child_process'

import wait from '../wait'
import fork from './mocks/fork.json'
import { forkRpcUrl, forkPort } from './constants'


const isAnvilReady = async () => {
  try {
    const response = await fetch(forkRpcUrl, {
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

const setup = async () => {
  const forkUrl = process.env.MAINNET_RPC_URL

  if (!forkUrl) {
    throw new Error('MAINNET_RPC_URL is required for fork tests (archive access to the block in fork.json)')
  }

  if (await isAnvilReady()) {
    throw new Error(`Port ${forkPort} is busy - stop the node listening on it, fork tests start their own anvil`)
  }

  const anvil = spawn('anvil', [
    '--fork-url', forkUrl,
    '--fork-block-number', String(fork.block),
    '--port', String(forkPort),
    '--auto-impersonate',
    '--silent',
  ], { stdio: 'inherit' })

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

    if (await isAnvilReady()) {
      return stop
    }

    await wait(300)
  }

  await stop()

  throw new Error('anvil did not start in 30 seconds')
}


export default setup
