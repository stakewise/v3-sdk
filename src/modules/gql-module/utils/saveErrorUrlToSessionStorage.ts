import { constants } from '../../../utils'


const sessionErrorUrl = constants.sessionStorageNames.moduleErrorUrl

const saveErrorUrlToSessionStorage = (url: string) => {
  const currentErrorUrl = sessionStorage.getItem(sessionErrorUrl)

  if (currentErrorUrl !== url) {
    sessionStorage.setItem(sessionErrorUrl, url)
  }
}


export default saveErrorUrlToSessionStorage
