import { vi, afterEach, beforeEach } from 'vitest'

import { constants } from '../src/helpers'
import localStorage from '../src/modules/local-storage'

import { resetGraphql, checkGraphqlRequests } from './mockGraphql'


// The urls check has its own spec, other specs don't mock its requests
vi.mock('../src/modules/gql-module/utils/checkRequestUrls', () => ({
  default: () => Promise.resolve(),
}))

beforeEach(() => {
  localStorage.removeSessionItem(constants.sessionStorageNames.moduleErrorUrl)

  resetGraphql()
})

afterEach(() => {
  checkGraphqlRequests()
})
