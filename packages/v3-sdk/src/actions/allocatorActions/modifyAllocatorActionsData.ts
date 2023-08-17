import { formatEther } from 'ethers'

import constants from '../../constants'

import { Input, Output } from './types'


const modifyAllocatorActions = (data: Input): Output => {
  return data.allocatorActions.map(({ id, actionType, assets, createdAt }) => {
    // TODO add tx hash to subgraph without log index
    const txHash = id.replace(/-.*/, '')

    return ({
      link: `${constants.etherscan}/tx/${txHash}`,
      assets: formatEther(assets || '0'),
      createdAt,
      actionType,
    })
  })
}


export default modifyAllocatorActions
