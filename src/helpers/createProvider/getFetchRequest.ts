import { FetchRequest } from 'ethers'


const baseCooldownMs = 10_000
const maxCooldownMs = 60_000

const getFetchRequest = (_url: string | StakeWise.UrlWithHeaders) => {
  const url = typeof _url === 'string' ? _url : _url.url
  const headers = typeof _url === 'string' ? {} : _url.headers

  // Why do we use FetchRequest and change the behavior of the 429 error?
  // Because inside ethers error 429 is handled only by resending the request
  // and in this case no additional node is started. This is a problem for public nodes,
  // so we think it is better to use an additional node in case of 429 error
  const fetchRequest = new FetchRequest(url)

  Object.keys(headers).forEach((key) => {
    fetchRequest.setHeader(key, headers[key])
  })

  fetchRequest.setThrottleParams({
    slotInterval: 2 * 1000,
    maxAttempts: 2,
  })

  // Throttle state: on 429 we set a cooldown that doubles
  // (10s, 20s, 40s, 60s max) and resets on a successful request.
  // If the server sends a Retry-After header, we use that value instead.
  let throttledUntil = 0
  let cooldownMs = baseCooldownMs

  fetchRequest.preflightFunc = async (request) => {
    const remaining = throttledUntil - Date.now()

    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining))
    }

    return request
  }

  // processFunc is called after retryFunc, including for 429 when retryFunc returns false
  fetchRequest.processFunc = async (_, response) => {
    if (response.statusCode !== 429) {
      throttledUntil = 0
      cooldownMs = baseCooldownMs
    }

    return response
  }

  fetchRequest.retryFunc = async (_, response) => {
    if (response.statusCode === 429) {
      const retryAfter = response.headers['retry-after']

      const retryAfterMs = retryAfter
        ? Number(retryAfter) * 1_000
        : 0

      if (retryAfterMs > 0) {
        throttledUntil = Date.now() + retryAfterMs
      }
      else {
        throttledUntil = Date.now() + cooldownMs
        cooldownMs = Math.min(maxCooldownMs, cooldownMs * 2)
      }

      return false
    }

    return true
  }

  return fetchRequest
}


export default getFetchRequest
