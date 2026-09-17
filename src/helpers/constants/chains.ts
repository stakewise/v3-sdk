import tokens from './tokens'
import { Network } from '../enums'


const mainnet = {
  id: 'mainnet',
  name: 'Ethereum',
  chainId: Network.Mainnet,
  hexadecimalChainId: '0x1',
  blockExplorerUrl: 'https://etherscan.io',
  nativeCurrency: {
    symbol: tokens.eth,
    name: 'Ethereum',
    decimals: 18,
  },
  isTestnet: false,
} as const

const hoodi = {
  id: 'hoodi',
  name: 'Hoodi Testnet',
  chainId: Network.Hoodi,
  hexadecimalChainId: '0x88bb0',
  blockExplorerUrl: 'https://hoodi.etherscan.io',
  nativeCurrency: {
    symbol: tokens.eth,
    name: 'Ethereum',
    decimals: 18,
  },
  isTestnet: true,
} as const

const gnosis = {
  id: 'gnosis',
  name: 'Gnosis Chain',
  chainId: Network.Gnosis,
  hexadecimalChainId: '0x64',
  blockExplorerUrl: 'https://gnosisscan.io',
  nativeCurrency: {
    symbol: tokens.xdai,
    name: tokens.xdai,
    decimals: 18,
  },
  isTestnet: false,
} as const


export default {
  mainnet,
  gnosis,
  hoodi,
}
