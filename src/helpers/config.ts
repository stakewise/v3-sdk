import { Network } from './enums'


// TODO add real vaules

const config = {
  [Network.Mainnet]: {
    api: {
      backend: 'https://api.stakewise.io/graphql',
      subgraph: 'https://graph.stakewise.io/subgraphs/name/stakewise/stakewise',
    },
    explorerUrl: 'https://etherscan.io',
    sharedMevEscrow: '',
  },
  [Network.Gnosis]: {
    api: {
      backend: 'https://api-gnosis.stakewise.io/graphql',
      subgraph: 'https://graph-gno.stakewise.io/subgraphs/name/stakewise/stakewise',
    },
    explorerUrl: 'https://blockscout.com/xdai/mainnet',
    sharedMevEscrow: '',
  },
  [Network.Goerli]: {
    api: {
      backend: 'https://api-pretest.stakewise.io/graphql',
      subgraph: 'https://graph-pretest.stakewise.io/subgraphs/name/stakewise/stakewise',
    },
    explorerUrl: 'https://goerli.etherscan.io',
    sharedMevEscrow: '0xE33E8b756Cc5F4B622ce9A0d29c392F5999DB547',
  },
}


export default config
