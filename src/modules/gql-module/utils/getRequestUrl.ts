import { constants } from '../../../helpers'
import localStorage from '../../local-storage'

import type { ErrorRecords } from '../types'


const sessionErrorUrl = constants.sessionStorageNames.moduleErrorUrl

const getErroredUrlFromSessionStorage = (primary: string): string | null => {
  const records = localStorage.getSessionItem<ErrorRecords>(sessionErrorUrl)
  const record = records?.[primary]

  if (!record) {
    return null
  }

  if (record.expiresAt <= Date.now()) {
    localStorage.setSessionItem(sessionErrorUrl, { ...records, [primary]: undefined })

    return null
  }

  return record.url
}

const getRequestUrl = (urls: string | ReadonlyArray<string>): string => {
  if (typeof urls === 'string') {
    return urls
  }

  if (!urls.length) {
    throw new Error('The array does not contain the url for the query')
  }

  if (urls.length === 1) {
    return urls[0]
  }

  const primary = urls[0]
  const backup  = urls[1]

  const errored = getErroredUrlFromSessionStorage(primary)

  return errored === primary ? backup : primary
}


export default getRequestUrl
