import { vi } from 'vitest'


export type GraphqlCall = {
  url: string
  operationName: string
  variables: Record<string, unknown>
}

type GraphqlAnswer = {
  status: number
  body: string
}

type MockGraphqlInput<T> = {
  name: string
  url?: string
  data: NoInfer<T>
}

type MockGraphqlErrorInput = {
  name: string
  url?: string
  code?: string
  message: string
  status?: number
}

const answers = new Map<string, GraphqlAnswer>()
export const calls: GraphqlCall[] = []
const unknownOperations: string[] = []
const unmockedRequests: string[] = []

const getAnswerKey = (name: string, url?: string) => (url ? `${name} ${url}` : name)

const queryNamePattern = /^\s*(?:query|mutation)\s+(\w+)/

const parseRequest = (init?: RequestInit) => {
  try {
    const { operationName, query, variables } = JSON.parse(String(init?.body))
    const [ , queryName ] = String(query).match(queryNamePattern) || []
    const name = typeof operationName === 'string' ? operationName : queryName

    return typeof name === 'string' ? { operationName: name, variables } : null
  }
  catch {
    return null
  }
}

const createResponse = ({ status, body }: GraphqlAnswer) => new Response(body, { status })

const createErrorAnswer = (message: string, status = 200, code?: string): GraphqlAnswer => ({
  status,
  body: JSON.stringify({ errors: [ code ? { message, extensions: { code } } : { message } ] }),
})

const fetchMock = async (url: string | URL, init?: RequestInit) => {
  const request = parseRequest(init)

  if (!request) {
    unmockedRequests.push(String(url))

    throw new Error(`fetch without mockGraphql: ${url}`)
  }

  const { operationName, variables } = request
  const [ requestUrl ] = String(url).split('?')
  const answer = answers.get(getAnswerKey(operationName, requestUrl)) || answers.get(operationName)

  calls.push({ url: requestUrl, operationName, variables })

  if (!answer) {
    unknownOperations.push(operationName)

    return createResponse(createErrorAnswer(`mockGraphql: no payload for ${operationName}`))
  }

  return createResponse(answer)
}

export const resetGraphql = () => {
  answers.clear()
  calls.splice(0)
  unknownOperations.splice(0)
  unmockedRequests.splice(0)

  vi.stubGlobal('fetch', fetchMock)
}

export const takeUnknownOperations = () => unknownOperations.splice(0)

export const takeUnmockedRequests = () => unmockedRequests.splice(0)

export const checkGraphqlRequests = () => {
  const unknown = takeUnknownOperations()
  const unmocked = takeUnmockedRequests()

  if (unknown.length > 0) {
    throw new Error(`mockGraphql got operations without a payload: ${unknown.join(', ')}`)
  }

  if (unmocked.length > 0) {
    throw new Error(`fetch without mockGraphql: ${unmocked.join(', ')}`)
  }
}

export const mockGraphqlError = ({ name, url, message, status, code }: MockGraphqlErrorInput) => {
  answers.set(getAnswerKey(name, url), createErrorAnswer(message, status, code))
}

const mockGraphql = <T = never>({ name, url, data }: MockGraphqlInput<T>) => {
  answers.set(getAnswerKey(name, url), { status: 200, body: JSON.stringify({ data }) })
}


export default mockGraphql
