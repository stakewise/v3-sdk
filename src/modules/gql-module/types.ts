export type FetchInput<Data, Variables, ModifiedData> = {
  url: string | ReadonlyArray<string>
  query: string
  withTime?: boolean
  variables?: Variables
  modifyResult?: (data: Data) => ModifiedData
}

export type FetchCodegenInput<Data, Variables, ModifiedData> = {
  url: string | ReadonlyArray<string>
  withTime?: boolean
  variables?: Variables
  modifyResult?: (data: Data) => ModifiedData
}

export type ErrorRecord = {
  url: string
  expiresAt: number
}
