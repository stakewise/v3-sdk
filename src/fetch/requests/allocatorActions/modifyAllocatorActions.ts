import { Network, constants } from 'helpers'
import { formatEther } from 'ethers'
import { AllocatorActionsQueryPayload } from 'graphql/subgraph/allocatorActions'

import { ModifiedAllocatorActions } from './types'


type ModifyAllocatorActionsInput = {
  data: AllocatorActionsQueryPayload
  network: Network
}

const modifyAllocatorActions = (values: ModifyAllocatorActionsInput): ModifiedAllocatorActions => {
  const { data, network } = values

  return data.allocatorActions.map((item) => ({
    ...item,
    assets: formatEther(item.assets),
    createdAt: Number(item.createdAt) * 1000,
    link: `${constants.explorerUrls[network]}/tx/${item.id.replace(/-.*/, '')}`,
  }))
}


export default modifyAllocatorActions
