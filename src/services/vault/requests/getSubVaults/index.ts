import type { SubVaultsQueryPayload, SubVaultsQueryVariables } from '../../../../graphql/subgraph/vault'
import { apiUrls, validateArgs } from '../../../../helpers'

import getVault from '../getVault'
import getExitQueuePositions from '../getExitQueuePositions'

import graphql from '../../../../graphql'


export type GetSubVaultsInput = StakeWise.CommonParams & {
  skip: SubVaultsQueryVariables['skip']
  limit: SubVaultsQueryVariables['first']
  vaultAddress: SubVaultsQueryVariables['where']['metaVault']
}

type OutputSubVault = {
  id: string
  apy: string
  imageUrl: string
  displayName: string
  stakingAssets: bigint
  exitingAssets: bigint
}

const getSubVaults = async (input: GetSubVaultsInput): Promise<OutputSubVault[]> => {
  const { skip, limit, vaultAddress, ...commonParams } = input

  validateArgs.address({ vaultAddress })
  validateArgs.number({ skip, limit })

  const url = apiUrls.getSubgraphqlUrl(commonParams.options)

  const metaVaultId = vaultAddress.toLowerCase()

  const subVaults = await graphql.subgraph.vault.fetchSubVaultsQuery({
    url,
    variables: {
      skip,
      first: limit,
      where: {
        metaVault_: {
          id: metaVaultId,
        },
      } as SubVaultsQueryVariables['where'],
    },
    modifyResult:(data: SubVaultsQueryPayload) => data.subVaults.map((item => item.subVault)),
  })

  const results = await Promise.all(
    subVaults.map(async (subVaultId) => {
      const vaultId = subVaultId.toLowerCase()

      const [ allocatorData, vaultData, exitQueue ] = await Promise.all([
        graphql.subgraph.allocator.fetchAllocatorsQuery({
          url,
          variables: {
            address: metaVaultId,
            vaultAddress: vaultId,
          },
          modifyResult: (data) => {
            const first = data?.allocators?.[0]

            return {
              assets: BigInt(first?.assets || 0),
              apy: (Number(first?.apy) || 0).toFixed(2),
            }
          },
        }),

        getVault({ ...commonParams, vaultAddress: vaultId }),

        getExitQueuePositions({
          ...commonParams,
          vaultAddress: vaultId,
          userAddress: metaVaultId,
        }),
      ])

      return {
        id: vaultId,
        apy: allocatorData.apy,
        imageUrl: vaultData.imageUrl,
        exitingAssets: exitQueue.total,
        displayName: vaultData.displayName,
        stakingAssets: allocatorData.assets,
      }
    })
  )

  return results
}


export default getSubVaults
