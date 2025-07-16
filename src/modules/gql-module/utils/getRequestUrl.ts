import { constants } from '../../../utils'
import localStorage from '../../local-storage'

import type { ErrorRecord } from '../types'


const sessionErrorUrl = constants.sessionStorageNames.moduleErrorUrl

const getErroredUrlFromSessionStorage = (): string | null => {
  const raw = localStorage.getSessionItem<string>(sessionErrorUrl)

  if (!raw) {
    return null
  }

  let rec: ErrorRecord

  try {
    rec = JSON.parse(raw)
  }
  catch {
    localStorage.removeSessionItem(sessionErrorUrl)

    return null
  }

  if (rec.expiresAt <= Date.now()) {
    localStorage.removeSessionItem(sessionErrorUrl)

    return null
  }

  return rec.url
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
