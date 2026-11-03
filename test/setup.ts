import { vi, afterEach, beforeEach } from 'vitest'

import { constants } from '../src/helpers'
import localStorage from '../src/modules/local-storage'
import RequestUrls from '../src/modules/gql-module/requestUrls'

import { resetGraphql, checkGraphqlRequests } from './mockGraphql'


// The subgraph check has its own spec, other specs don't mock its requests
// Mocked before any hook: fork specs make subgraph requests in beforeAll
vi.spyOn(RequestUrls.prototype, 'subgraphCheck').mockResolvedValue()

beforeEach(() => {
  localStorage.removeSessionItem(constants.sessionStorageNames.moduleErrorUrl)

  resetGraphql()
})

afterEach(() => {
  checkGraphqlRequests()
})
