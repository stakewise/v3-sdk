import { FallbackProvider, isError, Network } from 'ethers'
import type { AbstractProvider, JsonRpcSigner, Networkish, PerformActionRequest, TransactionResponse } from 'ethers'

import getRetryAfterMs from './getRetryAfterMs'


const stallTimeoutMs = 400
const maxFailures = 3
const baseCooldownMs = 60_000
const maxCooldownMs = 300_000
const requestErrorCodes = [ 'INSUFFICIENT_FUNDS', 'NONCE_EXPIRED', 'INVALID_ARGUMENT' ] as const

type Node = {
  provider: AbstractProvider
  failures: number
  cooldownMs: number
  cooldownUntil: number
}

const checkIsCooling = ({ cooldownUntil }: Node) => cooldownUntil > Date.now()

const getThrottleResponse = (error: unknown) => {
  const response = isError(error, 'SERVER_ERROR') ? error.response : null

  return response?.statusCode === 429 ? response : null
}

const checkIsRevert = (error: unknown) => {
  if (!isError(error, 'CALL_EXCEPTION')) {
    return false
  }

  const nodeMessage = error.info?.error?.message || ''

  return Boolean(error.data) || /revert/i.test(nodeMessage)
}

const checkIsRequestError = (error: unknown) => (
  checkIsRevert(error) || requestErrorCodes.some((code) => isError(error, code))
)

class CustomFallbackProvider extends FallbackProvider {
  #nodes: Node[]
  #network: Network

  constructor(providers: AbstractProvider[], network: Networkish) {
    const configs = providers.map((provider, index) => ({ provider, priority: index + 1, weight: 1 }))

    super(configs, network)

    this.#network = Network.from(network)
    this.#nodes = providers.map((provider) => ({
      provider,
      failures: 0,
      cooldownUntil: 0,
      cooldownMs: baseCooldownMs,
    }))
  }

  getSigner(): Promise<JsonRpcSigner> {
    throw new Error('Pass your provider to the SDK class instance to get a signer')
  }

  send(): Promise<TransactionResponse> {
    throw new Error('Pass your provider to the SDK class instance to use send method')
  }

  async _detectNetwork() {
    return this.#network
  }

  #getNodes() {
    const readyNodes = this.#nodes.filter((node) => !checkIsCooling(node))
    const coolingNodes = this.#nodes.filter((node) => !readyNodes.includes(node))

    return {
      nodes: [ ...readyNodes, ...coolingNodes ],
      readyCount: readyNodes.length,
    }
  }

  #handleSuccess(node: Node) {
    node.failures = 0
    node.cooldownUntil = 0
    node.cooldownMs = baseCooldownMs
  }

  #pause(node: Node) {
    node.cooldownUntil = Date.now() + Math.min(maxCooldownMs, node.cooldownMs)
    node.cooldownMs *= 2
  }

  #handleFailure(node: Node, error: unknown) {
    const throttleResponse = getThrottleResponse(error)
    const retryAfterMs = throttleResponse ? getRetryAfterMs(throttleResponse.headers) : 0

    if (retryAfterMs) {
      node.cooldownUntil = Date.now() + Math.min(maxCooldownMs, retryAfterMs)
      node.cooldownMs = baseCooldownMs

      return
    }

    if (checkIsCooling(node)) {
      return
    }

    node.failures += 1

    if (throttleResponse || node.failures >= maxFailures) {
      this.#pause(node)
    }
  }

  _perform<T = any>(request: PerformActionRequest): Promise<T> {
    if (request.method === 'broadcastTransaction') {
      return super._perform(request)
    }

    const { nodes, readyCount } = this.#getNodes()

    let nextIndex = 0
    let runningCount = 0
    let isSettled = false
    let lastError: unknown

    return new Promise<T>((resolve, reject) => {
      const startNext = () => {
        const node = nodes[nextIndex]
        const isReadyNodeRunning = nextIndex === readyCount && runningCount > 0

        if (!node && runningCount === 0) {
          reject(lastError)
        }

        if (isSettled || !node || isReadyNodeRunning) {
          return
        }

        nextIndex += 1
        runningCount += 1

        const isProbe = node.cooldownUntil > 0 && !checkIsCooling(node)

        if (isProbe) {
          this.#pause(node)
        }

        const { cooldownUntil } = node
        const timer = setTimeout(startNext, stallTimeoutMs)

        const onSettled = () => {
          clearTimeout(timer)
          runningCount -= 1
        }

        const handleAnswer = () => {
          if (node.cooldownUntil === cooldownUntil) {
            this.#handleSuccess(node)
          }
        }

        this._translatePerform(node.provider, request).then(
          (result) => {
            onSettled()
            handleAnswer()

            isSettled = true
            resolve(result)
          },
          (error) => {
            onSettled()

            if (checkIsRequestError(error)) {
              handleAnswer()

              isSettled = true
              reject(error)

              return
            }

            this.#handleFailure(node, error)

            lastError = error
            startNext()
          }
        )
      }

      startNext()
    })
  }
}


export default CustomFallbackProvider
