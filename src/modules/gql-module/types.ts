import { Network } from 'helpers'


export type FetchInput<Data, Variables, ModifiedData> = {
  url: string
  query: string
  variables?: Variables
  modifyResult?: (data: Data) => ModifiedData
}

export type FetchCodegenInput<Data, Variables, ModifiedData> = {
  network: Network
  variables?: Variables
  modifyResult?: (data: Data) => ModifiedData
}
