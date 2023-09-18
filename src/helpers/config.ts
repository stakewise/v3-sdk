import { Network } from './enums'


// TODO add real vaules

const config = {
  [Network.Mainnet]: {
    api: {
      backend: 'https://api.stakewise.io/graphql',
      subgraph: 'https://graph.stakewise.io/subgraphs/name/stakewise/stakewise',
    },
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213',
    addresses: {
      base: {
        keeper: '',
        sharedMevEscrow: '',
      },
    },
  },
  [Network.Gnosis]: {
    api: {
      backend: 'https://api-gnosis.stakewise.io/graphql',
      subgraph: 'https://graph-gno.stakewise.io/subgraphs/name/stakewise/stakewise',
    },
    explorerUrl: 'https://blockscout.com/xdai/mainnet',
    rpcUrl: 'https://rpc.gnosischain.com',
    addresses: {
      base: {
        keeper: '',
        sharedMevEscrow: '',
      },
    },
  },
  [Network.Goerli]: {
    api: {
      backend: 'https://testnet-api.stakewise.io/graphql',
      subgraph: 'https://testnet-graph.stakewise.io/subgraphs/name/stakewise/stakewise',
    },
    explorerUrl: 'https://goerli.etherscan.io',
    rpcUrl: 'https://goerli.infura.io/v3/84842078b09946638c03157f83405213',
    addresses: {
      base: {
        keeper: '0x893ceb1cF23475defE3747670EbE4b40e629c6fD',
        sharedMevEscrow: '0xb793c3D2Cec1d0F35fF88BCA7655B88A44669e4B',
      },
    },
  },
} as const


export default config
