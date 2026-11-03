import { vi, afterEach, beforeEach } from 'vitest'

import { constants } from '../src/helpers'
import localStorage from '../src/modules/local-storage'
import RequestUrls from '../src/modules/gql-module/requestUrls'

import { resetGraphql, checkGraphqlRequests } from './mockGraphql'


beforeEach(() => {
  // The subgraph check has its own spec, other specs don't mock its requests
  vi.spyOn(RequestUrls.prototype, 'subgraphCheck').mockResolvedValue()

  localStorage.removeSessionItem(constants.sessionStorageNames.moduleErrorUrl)

  resetGraphql()
})

afterEach(() => {
  checkGraphqlRequests()
})
