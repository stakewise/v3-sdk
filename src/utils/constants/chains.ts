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

const holesky = {
  id: 'holesky',
  name: 'Holesky Testnet',
  chainId: Network.Holesky,
  hexadecimalChainId: '0x4268',
  blockExplorerUrl: 'https://holesky.etherscan.io',
  nativeCurrency: {
    symbol: tokens.eth,
    name: 'Ethereum',
    decimals: 18,
  },
  isTestnet: true,
} as const

const chiado = {
  id: 'chiado',
  name: 'Chiado Testnet',
  chainId: Network.Chiado,
  hexadecimalChainId: '0x27D8',
  blockExplorerUrl: 'https://gnosis-chiado.blockscout.com',
  nativeCurrency: {
    symbol: tokens.xdai,
    name: tokens.xdai,
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
  holesky,
  chiado,
  gnosis,
}
