import { Network } from '../enums'
import mainnet from './mainnet'
import goerli from './goerli'
import gnosis from './gnosis'


export default {
  [Network.Mainnet]: mainnet,
  [Network.Goerli]: goerli,
  [Network.Gnosis]: gnosis,
}
