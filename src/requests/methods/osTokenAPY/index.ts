import calculateAPY from './calculateAPY'
import fetchOsTokenSnapshots from './fetchOsTokenSnapshots'


type ExitQueueInput = {
  options: SDK.Options
}

const osTokenAPY = async (input: ExitQueueInput) => {
  const { options } = input

  const osTokenSnapshots = await fetchOsTokenSnapshots({ options })

  return calculateAPY({ osTokenSnapshots })
}


export default osTokenAPY
