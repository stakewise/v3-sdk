import type { AllocatorActionsQueryVariables, AllocatorActionsQueryPayload } from '../../../../graphql/subgraph/allocatorActions'
import { apiUrls, validateArgs, getTimestamp, AllocatorActionType } from '../../../../utils'
import graphql from '../../../../graphql'

import specialCalculate from './specialCalculate'


type SpecialFetchInput = {
  daysCount: number
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
}

const isSameDay = (microseconds: number, seconds: number) => {
  const date1 = new Date(microseconds / 1000)
  const date2 = new Date(seconds * 1000)

  const year1 = date1.getFullYear()
  const month1 = date1.getMonth()
  const day1 = date1.getDate()

  const year2 = date2.getFullYear()
  const month2 = date2.getMonth()
  const day2 = date2.getDate()

  return year1 === year2 && month1 === month2 && day1 === day2
}

const specialFetch = async (input: SpecialFetchInput) => {
  const { options, userAddress, vaultAddress, daysCount } = input

  validateArgs.address({ vaultAddress, userAddress })
  validateArgs.number({ daysCount })

  let alocatorsForProxy: AllocatorActionsQueryPayload | undefined = undefined

  const boostMainData = await graphql.subgraph.boost.fetchBoostMainDataQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      userAddress: userAddress.toLowerCase(),
      vaultAddress: vaultAddress.toLowerCase(),
    },
  })

  console.log('boostMainData', boostMainData)

  const alocators = await graphql.subgraph.allocatorActions.fetchAllocatorActionsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      skip: 0,
      first: 1000,
      where: {
        actionType_in: [
          AllocatorActionType.BoostDeposited,
          AllocatorActionType.BoostExitedAssetsClaimed,
        ],
        vault_: { id: vaultAddress.toLowerCase() },
        address: userAddress ? userAddress.toLowerCase() : undefined,
      } as AllocatorActionsQueryVariables['where'],
    },
  })

  console.log('alocators', alocators)

  if (boostMainData.leverageStrategyPositions?.[0]?.proxy) {
    alocatorsForProxy = await graphql.subgraph.allocatorActions.fetchAllocatorActionsQuery({
      url: apiUrls.getSubgraphqlUrl(options),
      variables: {
        skip: 0,
        first: 1000,
        where: {
          actionType_in: [
            AllocatorActionType.ExitQueueEntered,
          ],
          vault_: { id: vaultAddress.toLowerCase() },
          address: boostMainData.leverageStrategyPositions[0].proxy.toLowerCase(),
        } as AllocatorActionsQueryVariables['where'],
      },
    })
  }

  let boostActionsTimes = [
    ...alocators.allocatorActions.map((item) => Number(item.createdAt)),
  ]

  if (alocatorsForProxy?.allocatorActions.length) {
    boostActionsTimes = boostActionsTimes.concat(
      alocatorsForProxy.allocatorActions.map((item) => Number(item.createdAt))
    )
  }

  const rewards = await graphql.subgraph.vault.fetchUserRewardsSpecialQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      limit: daysCount,
      where: {
        timestamp_gte: String(getTimestamp(daysCount)),
        allocator_: {
          address: userAddress.toLowerCase(),
          vault: vaultAddress.toLowerCase(),
        },
      },
    },
  })

  console.log('rewards', rewards)

  return specialCalculate(rewards.allocator.map((item) => {
    const hasBoostActions = Boolean(boostActionsTimes.length)

    if (!hasBoostActions) {
      return item
    }

    const boostActionTime = boostActionsTimes.find((seconds) => isSameDay(Number(item.timestamp), seconds))

    return {
      ...item,
      boostActionTime,
      isBoostAction: Boolean(boostActionTime),
    }
  }))
}


export default specialFetch
