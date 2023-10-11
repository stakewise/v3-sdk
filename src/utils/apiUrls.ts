import configs from './configs'


const getWeb3Url = (options: StakeWise.Options) => options.endpoints?.web3 || configs[options.network].network.url
const getBackendUrl = (options: StakeWise.Options) => options.endpoints?.api || configs[options.network].api.backend
const getSubgraphqlUrl = (options: StakeWise.Options) => options.endpoints?.subgraph || configs[options.network].api.subgraph


export default {
  getWeb3Url,
  getBackendUrl,
  getSubgraphqlUrl,
}
