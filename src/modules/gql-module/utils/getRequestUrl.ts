import { constants } from '../../../helpers'
import localStorage from '../../local-storage'

import type { ErrorRecord } from '../types'


const sessionErrorUrl = constants.sessionStorageNames.moduleErrorUrl

const getErroredUrlFromSessionStorage = (): string | null => {
  const sessionRecord = localStorage.getSessionItem<ErrorRecord>(sessionErrorUrl)

  if (!sessionRecord) {
    return null
  }

  if (sessionRecord.expiresAt <= Date.now()) {
    localStorage.removeSessionItem(sessionErrorUrl)

    return null
  }

  return sessionRecord.url
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

  const errored = getErroredUrlFromSessionStorage()

  return errored === primary ? backup : primary
}


export default getRequestUrl
