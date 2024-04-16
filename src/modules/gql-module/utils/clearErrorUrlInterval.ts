import { constants } from '../../../utils'


const sessionErrorUrl = constants.sessionStorageNames.moduleErrorUrl

const clearErrorUrlInterval = () => {
  setInterval(() => {
    const currentErrorUrl = sessionStorage.getItem(sessionErrorUrl)
    if (currentErrorUrl) {
      sessionStorage.removeItem(sessionErrorUrl)
    }
  }, 3_600_000) // 1 hour
}


export default clearErrorUrlInterval
