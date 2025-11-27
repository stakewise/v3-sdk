import { Network } from './enums'


const getNetworkTypes = (options: StakeWise.Options) => {
  const network = options.network

  const isEthereum = (
    network === Network.Mainnet
    || network === Network.Hoodi
  )

  const isGnosis = (
    network === Network.Gnosis
    || network === Network.Chiado
  )

  return { isEthereum, isGnosis }
}


export default getNetworkTypes
