import { constants } from '../../../utils'
import localStorage from '../../local-storage'

import type { ErrorRecord } from '../types'


const SESSION_KEY = constants.sessionStorageNames.moduleErrorUrl
const ERROR_TTL = 60 * 60 * 1_000 // 1hr

const saveErrorUrlToSessionStorage = (baseUrl: string): void => {
  const record: ErrorRecord = {
    url: baseUrl,
    expiresAt: Date.now() + ERROR_TTL,
  }

  localStorage.setSessionItem(SESSION_KEY, JSON.stringify(record))
}


export default saveErrorUrlToSessionStorage
