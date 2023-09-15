import { Network } from './enums'


const urls: Record<Network, Record<'backend' | 'subgraph', string>> = {
  [Network.Mainnet]: {
    backend: 'https://api.stakewise.io/graphql',
    subgraph: 'https://graph.stakewise.io/subgraphs/name/stakewise/stakewise',
  },
  [Network.Gnosis]: {
    backend: 'https://api-gnosis.stakewise.io/graphql',
    subgraph: 'https://graph-gno.stakewise.io/subgraphs/name/stakewise/stakewise',
  },
  [Network.Goerli]: {
    backend: 'https://api-pretest.stakewise.io/graphql',
    subgraph: 'https://graph-pretest.stakewise.io/subgraphs/name/stakewise/stakewise',
  },
}

const sharedMevEscrow = '0xE33E8b756Cc5F4B622ce9A0d29c392F5999DB547'


export default {
  urls,
  Network,
  sharedMevEscrow,
}
