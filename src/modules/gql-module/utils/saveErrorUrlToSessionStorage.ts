import { constants } from '../../../helpers'
import localStorage from '../../local-storage'

import type { ErrorRecord } from '../types'


const sessionErrorUrl = constants.sessionStorageNames.moduleErrorUrl
const expireTime = 60 * 60 * 1_000 // 1hr

const saveErrorUrlToSessionStorage = (baseUrl: string): void => {
  const record: ErrorRecord = {
    url: baseUrl,
    expiresAt: Date.now() + expireTime,
  }

  localStorage.setSessionItem(sessionErrorUrl, record)
}


export default saveErrorUrlToSessionStorage
