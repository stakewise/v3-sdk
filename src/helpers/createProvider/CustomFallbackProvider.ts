import { FallbackProvider, isError } from 'ethers'
import type { AbstractProvider, JsonRpcSigner, Networkish, PerformActionRequest, TransactionResponse } from 'ethers'


const stallTimeoutMs = 400
const maxFailures = 3
const cooldownMs = 60_000
const requestErrorCodes = [ 'INSUFFICIENT_FUNDS', 'NONCE_EXPIRED', 'REPLACEMENT_UNDERPRICED', 'INVALID_ARGUMENT' ] as const

type Node = {
  provider: AbstractProvider
  failures: number
  cooldownUntil: number
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

  constructor(providers: AbstractProvider[], network: Networkish) {
    const configs = providers.map((provider, index) => ({ provider, priority: index + 1, weight: 1 }))

    super(configs, network)

    this.#nodes = providers.map((provider) => ({ provider, failures: 0, cooldownUntil: 0 }))
  }

  getSigner(): Promise<JsonRpcSigner> {
    throw new Error('Pass your provider to the SDK class instance to get a signer')
  }

  send(): Promise<TransactionResponse> {
    throw new Error('Pass your provider to the SDK class instance to use send method')
  }

  #getNodes() {
    const now = Date.now()

    const readyNodes = this.#nodes.filter(({ cooldownUntil }) => cooldownUntil <= now)
    const coolingNodes = this.#nodes.filter(({ cooldownUntil }) => cooldownUntil > now)

    return [ ...readyNodes, ...coolingNodes ]
  }

  _perform<T = any>(request: PerformActionRequest): Promise<T> {
    if (request.method === 'broadcastTransaction') {
      return super._perform(request)
    }

    const nodes = this.#getNodes()

    let nextIndex = 0
    let runningCount = 0
    let isSettled = false
    let lastError: unknown

    return new Promise<T>((resolve, reject) => {
      const rejectIfDone = () => {
        const isDone = !isSettled && runningCount === 0 && nextIndex >= nodes.length

        if (isDone) {
          isSettled = true
          reject(lastError)
        }
      }

      const startNext = () => {
        const node = nodes[nextIndex]

        if (isSettled || !node) {
          rejectIfDone()

          return
        }

        nextIndex += 1
        runningCount += 1

        const timer = setTimeout(startNext, stallTimeoutMs)

        const onSettled = () => {
          clearTimeout(timer)
          runningCount -= 1
        }

        this._translatePerform(node.provider, request).then(
          (result) => {
            onSettled()

            node.failures = 0
            node.cooldownUntil = 0

            isSettled = true
            resolve(result)
          },
          (error) => {
            onSettled()

            if (checkIsRequestError(error)) {
              isSettled = true
              reject(error)

              return
            }

            node.failures += 1

            if (node.failures >= maxFailures) {
              node.cooldownUntil = Date.now() + cooldownMs
            }

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
