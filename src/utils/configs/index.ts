import { Network } from '../enums'
import mainnet from './mainnet'
import holesky from './holesky'
import goerli from './goerli'
import gnosis from './gnosis'


export default {
  [Network.Mainnet]: mainnet,
  [Network.Holesky]: holesky,
  [Network.Goerli]: goerli,
  [Network.Gnosis]: gnosis,
}
