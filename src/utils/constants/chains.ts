import tokens from './tokens'
import { Network } from '../enums'


const mainnet = {
  id: 'mainnet',
  name: 'Ethereum',
  chainId: Network.Mainnet,
  hexadecimalChainId: '0x1',
  blockExplorerUrl: 'https://etherscan.io',
  url: 'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213',
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
  url: 'https://ethereum-holesky.publicnode.com/',
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
  url: 'https://rpc.chiadochain.net',
  blockExplorerUrl: 'https://gnosis-chiado.blockscout.com/',
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
  url: 'https://rpc.gnosischain.com',
  blockExplorerUrl: 'https://blockscout.com/xdai/mainnet',
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
