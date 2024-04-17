import { constants } from '../../../utils'


const sessionErrorUrl = constants.sessionStorageNames.moduleErrorUrl

const saveErrorUrlToSessionStorage = (url: string) => {
  const currentErrorUrl = sessionStorage.getItem(sessionErrorUrl)

  if (currentErrorUrl !== url) {
    sessionStorage.setItem(sessionErrorUrl, url)

    setTimeout(() => {
      sessionStorage.removeItem(sessionErrorUrl)
    },  60 * 60 * 1000) // 1 hour
  }
}


export default saveErrorUrlToSessionStorage
