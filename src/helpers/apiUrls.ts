import configs from './configs'


const getBackendUrl = (options: StakeWise.Options) => options.endpoints?.api || configs[options.network].api.backend

const getSubgraphParams = (options: StakeWise.Options) => ({
  url: options.endpoints?.subgraph || configs[options.network].api.subgraph,
  subgraphError: options.allowSubgraphError
    ? 'allow' as const
    : 'deny' as const,
  onSubgraphError: options.onSubgraphError,
})


export default {
  getBackendUrl,
  getSubgraphParams,
}
