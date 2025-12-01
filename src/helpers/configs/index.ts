import { Network } from '../enums'
import mainnet from './mainnet'
import gnosis from './gnosis'
import hoodi from './hoodi'


export default {
  [Network.Mainnet]: mainnet,
  [Network.Hoodi]: hoodi,
  [Network.Gnosis]: gnosis,
}
