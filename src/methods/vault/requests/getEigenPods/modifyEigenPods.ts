import { formatEther } from 'ethers'

import type { ModifiedEigenPods } from './types'
import { Network, configs } from '../../../../utils'
import type { EigenPodsQueryPayload } from '../../../../graphql/subgraph/eigenPods'


type ModifyEigenPodsInput = {
  data: EigenPodsQueryPayload
  network: Network
}

const modifyEigenPods = (input: ModifyEigenPodsInput): ModifiedEigenPods => {
  const { data, network } = input

  const eigenPods = data?.eigenPods || []

  return eigenPods.map((item) => {
    const { shares, operator, createdAt, address } = item

    return {
      ...item,
      podAddress: address,
      createdAt: Number(createdAt) * 1000,
      restaked: formatEther(shares || 0),
      link: `${configs[network].pages.beaconchain}/operator/${operator}`,
    }
  })
}


export default modifyEigenPods
