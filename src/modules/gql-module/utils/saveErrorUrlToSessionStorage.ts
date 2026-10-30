import { constants } from '../../../helpers'
import localStorage from '../../local-storage'

import type { ErrorRecords } from '../types'


const sessionErrorUrl = constants.sessionStorageNames.moduleErrorUrl
const defaultExpireTime = 60 * 60 * 1_000 // 1hr

const saveErrorUrlToSessionStorage = (urls: ReadonlyArray<string>, url: string, expireTime = defaultExpireTime): void => {
  const records = localStorage.getSessionItem<ErrorRecords>(sessionErrorUrl)

  localStorage.setSessionItem(sessionErrorUrl, {
    ...records,
    [urls[0]]: {
      url,
      expiresAt: Date.now() + expireTime,
    },
  })
}


export default saveErrorUrlToSessionStorage
