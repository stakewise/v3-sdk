import { Network } from '../enums'
import chiado from './chiado'
import mainnet from './mainnet'
import gnosis from './gnosis'


export default {
  [Network.Mainnet]: mainnet,

  [Network.Gnosis]: gnosis,
  [Network.Chiado]: chiado,
}
