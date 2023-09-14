export type FetchInput<Data, Variables, ModifiedData> = {
  url: string
  query: string
  variables?: Variables
  modifyResult?: (data: Data) => ModifiedData
}

export type FetchCodegenInput<Data, Variables, ModifiedData> = {
  variables?: Variables
  modifyResult?: (data: Data) => ModifiedData
}
