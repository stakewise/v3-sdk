import { vi } from 'vitest'
import { getAddress } from 'ethers'

import classifyProbe from './classifyProbe'
import mockForkHarvestParams from './mockForkHarvestParams'
import type { Fork } from './useForkSdk'


export type ProbeCall = (fork: Fork) => Promise<unknown>

type SendCall = [ string, Array<{ to?: string }> ]

type ProbeError = Error & {
  shortMessage?: string
}

const getCallTargets = (calls: SendCall[]) => {
  const targets = calls
    .filter(([ method ]) => method === 'eth_call' || method === 'eth_estimateGas')
    .flatMap(([ , [ { to } ] ]) => (to ? [ to.toLowerCase() ] : []))

  return [ ...new Set(targets) ]
}

const getErrorText = (error: unknown) => {
  if (error instanceof Error) {
    const { name, message, shortMessage, cause } = error as ProbeError
    const text = `${name}: ${shortMessage || message}`

    return cause instanceof Error ? `${text} (cause: ${cause.message})` : text
  }

  return String(error)
}

const checkProbe = async (fork: Fork, call: ProbeCall) => {
  const { sdk, provider, snapshot } = fork
  const canHarvest = await sdk.contracts.base.keeper.canHarvest(getAddress(snapshot.vaultAddress))

  mockForkHarvestParams(snapshot, canHarvest)

  const send = vi.spyOn(provider, 'send')
  const result = await call(fork).then((value) => ({ value }), (error: unknown) => ({ error }))
  const targets = getCallTargets(send.mock.calls as SendCall[])

  send.mockRestore()

  const codes = await Promise.all(targets.map((target) => provider.getCode(target)))
  const emptyTargets = targets.filter((_, index) => codes[index] === '0x')

  const outcome = classifyProbe(result)
  const cause = 'error' in result ? getErrorText(result.error) : ''

  return { outcome, cause, emptyTargets }
}


export default checkProbe
