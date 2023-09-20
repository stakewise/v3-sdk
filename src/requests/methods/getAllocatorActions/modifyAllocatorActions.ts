import { Network, configs } from 'helpers'
import { formatEther } from 'ethers'
import { AllocatorActionsQueryPayload } from 'graphql/subgraph/allocatorActions'

import { ModifiedAllocatorActions } from './types'


type ModifyAllocatorActionsInput = {
  data: AllocatorActionsQueryPayload
  network: Network
}

const modifyAllocatorActions = (input: ModifyAllocatorActionsInput): ModifiedAllocatorActions => {
  const { data, network } = input

  return data.allocatorActions.map((item) => ({
    ...item,
    assets: formatEther(item.assets),
    createdAt: Number(item.createdAt) * 1000,
    link: `${configs[network].network.blockExplorerUrl}/tx/${item.id.replace(/-.*/, '')}`,
  }))
}


export default modifyAllocatorActions
