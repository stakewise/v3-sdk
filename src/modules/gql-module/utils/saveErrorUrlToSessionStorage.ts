import { constants } from '../../../utils'


const sessionErrorUrl = constants.sessionStorageNames.moduleErrorUrl
let clearIntervalId: NodeJS.Timeout | null = null

const saveErrorUrlToSessionStorage = (url: string) => {
  const currentErrorUrl = sessionStorage.getItem(sessionErrorUrl)

  if (currentErrorUrl !== url) {
    sessionStorage.setItem(sessionErrorUrl, url)
  }

  if (clearIntervalId !== null) {
    clearInterval(clearIntervalId)
  }

  clearIntervalId = setInterval(() => {
    sessionStorage.removeItem(sessionErrorUrl)
  }, 3_600_000) // 1 hour
}


export default saveErrorUrlToSessionStorage
