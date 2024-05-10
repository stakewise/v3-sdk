import { constants } from '../../../utils'
import localStorage from './local-storage'


const sessionErrorUrl = constants.sessionStorageNames.moduleErrorUrl

const saveErrorUrlToSessionStorage = (url: string) => {
  const currentErrorUrl = localStorage.getSessionItem<string>(sessionErrorUrl)

  if (currentErrorUrl !== url) {
    localStorage.setSessionItem(sessionErrorUrl, url)

    setTimeout(() => {
      localStorage.removeSessionItem(sessionErrorUrl)
    },  60 * 60 * 1000) // 1 hour
  }
}


export default saveErrorUrlToSessionStorage
