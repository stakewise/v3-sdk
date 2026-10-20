import { parseEther, toQuantity } from 'ethers'
import type { JsonRpcProvider } from 'ethers'


const fundAccount = (provider: JsonRpcProvider, address: string) => (
  provider.send('anvil_setBalance', [ address, toQuantity(parseEther('10')) ])
)


export default fundAccount
