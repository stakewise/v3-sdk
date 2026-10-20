import { expect } from 'vitest'
import { Interface } from 'ethers'
import type { TransactionReceipt } from 'ethers'


const rewardSplitterFactoryEvents = new Interface([
  'event RewardSplitterCreated(address owner, address vault, address rewardSplitter)',
])

const parseRewardSplitterCreated = (receipt: TransactionReceipt | null, factoryAddress: string) => {
  const events = (receipt?.logs || [])
    .filter((log) => log.address === factoryAddress)
    .map((log) => rewardSplitterFactoryEvents.parseLog(log))

  expect(events, 'the factory must emit one RewardSplitterCreated event').toHaveLength(1)

  const [ event ] = events

  return {
    owner: event?.args.owner,
    vault: event?.args.vault,
    rewardSplitter: event?.args.rewardSplitter,
  }
}


export default parseRewardSplitterCreated
