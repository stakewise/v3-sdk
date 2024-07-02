import { formatEther } from 'ethers'

import { Network } from '../../../../utils'
import type { ModifiedEigenPods } from './types'
import type { EigenPodsQueryPayload } from '../../../../graphql/subgraph/eigenPods'


type ModifyEigenPodsInput = {
  data: EigenPodsQueryPayload
  network: Network
}

const subgraphNetworkLink = {
  [Network.Mainnet] : 'https://app.eigenlayer.xyz/operator',
  [Network.Holesky] : 'https://holesky.eigenlayer.xyz/operator',
}

const modifyEigenPods = (input: ModifyEigenPodsInput): ModifiedEigenPods => {
  const { data, network } = input

  const eigenPods = data?.eigenPods || []

  return eigenPods.map((item) => {
    const { id, shares, operator, createdAt, address } = item

    const link = subgraphNetworkLink[network as keyof typeof subgraphNetworkLink]

    return {
      operator,
      owner: id,
      podAddress: address,
      link: `${link}/${operator}`,
      createdAt: Number(createdAt) * 1000,
      restaked: formatEther(shares || 0),
    }
  })
}


export default modifyEigenPods
