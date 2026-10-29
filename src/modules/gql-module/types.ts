export type SubgraphErrorPolicy = 'allow' | 'deny'

export type SubgraphErrorEvent = {
  url: string
  operationName: string
  variables?: unknown
  errors: Array<{ message: string }>
  isAllowed: boolean // true - data returned to the caller, false - the request was rejected
}

export type OnSubgraphError = (event: SubgraphErrorEvent) => void

export type FetchInput<Data, Variables, ModifiedData> = {
  url: string | ReadonlyArray<string>
  query: string
  withTime?: boolean
  variables?: Variables
  subgraphError?: SubgraphErrorPolicy
  onSubgraphError?: OnSubgraphError
  modifyResult?: (data: Data) => ModifiedData
}

export type FetchCodegenInput<Data, Variables, ModifiedData> = {
  url: string | ReadonlyArray<string>
  withTime?: boolean
  variables?: Variables
  subgraphError?: SubgraphErrorPolicy
  onSubgraphError?: OnSubgraphError
  modifyResult?: (data: Data) => ModifiedData
}

export type ErrorRecord = {
  url: string
  expiresAt: number
}
