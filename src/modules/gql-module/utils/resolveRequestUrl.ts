import getRequestUrl from './getRequestUrl'
import checkRequestUrls from './checkRequestUrls'


const resolveRequestUrl = async (urls: string | ReadonlyArray<string>): Promise<string> => {
  if (typeof urls !== 'string' && urls.length > 1) {
    await checkRequestUrls(urls)
  }

  return getRequestUrl(urls)
}


export default resolveRequestUrl
