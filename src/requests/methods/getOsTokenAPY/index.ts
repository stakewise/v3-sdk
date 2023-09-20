import calculateAPY from './calculateAPY'
import fetchOsTokenSnapshots from './fetchOsTokenSnapshots'


type GetOsTokenApyInput = {
  options: SDK.Options
}

const getOsTokenAPY = async (input: GetOsTokenApyInput) => {
  const { options } = input

  const osTokenSnapshots = await fetchOsTokenSnapshots({ options })

  return calculateAPY({ osTokenSnapshots })
}


export default getOsTokenAPY
