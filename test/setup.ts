import { afterEach, beforeEach } from 'vitest'

import { constants } from '../src/helpers'
import localStorage from '../src/modules/local-storage'

import { resetGraphql, checkGraphqlRequests } from './mockGraphql'


beforeEach(() => {
  localStorage.removeSessionItem(constants.sessionStorageNames.moduleErrorUrl)

  resetGraphql()
})

afterEach(() => {
  checkGraphqlRequests()
})
