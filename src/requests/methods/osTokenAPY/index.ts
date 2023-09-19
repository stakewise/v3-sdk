import { Network } from 'helpers'

import calculateAPY from './calculateAPY'
import fetchOsTokenSnapshots from './fetchOsTokenSnapshots'


type ExitQueueInput = {
  network: Network
}

const osTokenAPY = async (input: ExitQueueInput) => {
  const { network } = input

  const osTokenSnapshots = await fetchOsTokenSnapshots({ network })

  return calculateAPY({ osTokenSnapshots })
}


export default osTokenAPY
