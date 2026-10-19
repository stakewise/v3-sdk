import { afterEach, beforeEach } from 'vitest'

import { constants } from '../src/helpers'
import localStorage from '../src/modules/local-storage'

import { resetGraphql, takeUnknownOperations, takeUnmockedRequests } from './mockGraphql'


beforeEach(() => {
  localStorage.removeSessionItem(constants.sessionStorageNames.moduleErrorUrl)

  resetGraphql()
})

afterEach(() => {
  const unknownOperations = takeUnknownOperations()
  const unmockedRequests = takeUnmockedRequests()

  if (unknownOperations.length > 0) {
    throw new Error(`mockGraphql got operations without a payload: ${unknownOperations.join(', ')}`)
  }

  if (unmockedRequests.length > 0) {
    throw new Error(`fetch without mockGraphql: ${unmockedRequests.join(', ')}`)
  }
})
