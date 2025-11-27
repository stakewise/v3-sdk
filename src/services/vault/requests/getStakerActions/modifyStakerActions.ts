import { formatEther } from 'ethers'

import type { AllocatorActionsQueryPayload } from '../../../../graphql/subgraph/allocatorActions'
import { Network, configs } from '../../../../helpers'
import { ModifiedStakerActions } from './types'


type ModifyStakerActionsInput = {
  data: AllocatorActionsQueryPayload
  network: Network
}

const modifyStakerActions = (input: ModifyStakerActionsInput): ModifiedStakerActions => {
  const { data, network } = input

  return data?.allocatorActions.map((item) => ({
    ...item,
    shares: formatEther(item.shares || 0),
    assets: formatEther(item.assets || 0),
    createdAt: Number(item.createdAt) * 1000,
    link: `${configs[network].network.blockExplorerUrl}/tx/${item.id.replace(/-.*/, '')}`,
  })) || []
}


export default modifyStakerActions
