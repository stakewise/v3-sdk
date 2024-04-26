export type FetchInput<Data, Variables, ModifiedData> = {
  url: string | ReadonlyArray<string>
  query: string
  variables?: Variables
  modifyResult?: (data: Data) => ModifiedData
}

export type FetchCodegenInput<Data, Variables, ModifiedData> = {
  url: string | ReadonlyArray<string>
  variables?: Variables
  modifyResult?: (data: Data) => ModifiedData
}
