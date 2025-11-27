import configs from './configs'


const getBackendUrl = (options: StakeWise.Options) => options.endpoints?.api || configs[options.network].api.backend
const getSubgraphqlUrl = (options: StakeWise.Options) => options.endpoints?.subgraph || configs[options.network].api.subgraph


export default {
  getBackendUrl,
  getSubgraphqlUrl,
}
