import { constants } from '../../../utils'


const sessionErrorUrl = constants.sessionStorageNames.moduleErrorUrl

const getRequestUrl = (url: string | ReadonlyArray<string>): string => {
  const isArray = Array.isArray(url)

  if (isArray) {
    const count = url.length

    if (!count) {
      throw new Error('The array does not contain the url for the query')
    }

    if (count === 1) {
      return url[0]
    }

    const [ primaryUrl, backupUrl ] = url

    const hasError = sessionStorage.getItem(sessionErrorUrl) === primaryUrl

    return hasError ? backupUrl : primaryUrl
  }

  return url as string
}


export default getRequestUrl
