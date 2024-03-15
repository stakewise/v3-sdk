import { Network } from '../enums'
import chiado from './chiado'
import mainnet from './mainnet'
import holesky from './holesky'
import gnosis from './gnosis'


export default {
  [Network.Mainnet]: mainnet,
  [Network.Holesky]: holesky,

  [Network.Gnosis]: gnosis,
  [Network.Chiado]: chiado,
}
