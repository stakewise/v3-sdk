import { describe, expect } from 'vitest'

import { it } from '../../../../../test'
import { useForkSdk, fundAccount, sendForkTransaction } from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


const claimantAddress = '0x13F210c8bAf5f5DBAFf3E917E2e5A49E73BBAF12'

const amounts = [ 5_875_329_009_926_653_728_120n, 48_726_176_995_701_583n ]
const cumulativeAmounts = amounts.map(String)

const proof = [
  '0xc25fba2f1de06849acf4799b2dc025111ae284327f8c4f291bb66f953ba25fb3',
  '0xa85832faa4641a4a6b5b5cb913d4c91b96f5972bf90ef21e8f777888759f525e',
  '0xee7172f9f2bf76127b12e81f1d333744552b5514cb040215213151f073eb4bb5',
  '0xbaf4357c11576986c5d2f54fcd880c29173be8230540c6d51c269939fad1e59e',
  '0x99bbab08e4a6e1e1be6916eb8b341ed6f1cdba785f1d52244990f6c76b4c968e',
  '0xa28be74956354cffc58c07f9cc78b1b78492d01c6814ce194f541583bd242ff6',
  '0x4f1979691dbe622bf51b458d92235af98997e86acb775cc57617d938267b7af1',
  '0x96a09babf041808259111d001a7714e54922f894fe0b276ec5e7a524d77ff5d2',
]

const fundClaimant = ({ provider }: Fork) => fundAccount(provider, claimantAddress)

describe('claim', () => {
  const { sdk, provider } = useForkSdk({ setup: fundClaimant })
  const { swise, mintToken } = sdk.config.addresses.tokens
  const tokens = [ swise, mintToken ]
  const tokenContracts = tokens.map((token) => sdk.contracts.helpers.createErc20(token))

  const input = {
    proof,
    tokens,
    cumulativeAmounts,
    userAddress: claimantAddress,
  }

  const getBalances = () => Promise.all(tokenContracts.map((tokenContract) => tokenContract.balanceOf(claimantAddress)))

  it('claim', async () => {
    const balancesBefore = await getBalances()

    await sendForkTransaction({
      input,
      provider,
      method: sdk.distributorRewards.claim,
      contract: sdk.contracts.special.merkleDistributorV2,
      calls: [ { name: 'claim', args: [ claimantAddress, tokens, amounts, proof ] } ],
    })

    const balancesAfter = await getBalances()
    const claimedAmounts = balancesAfter.map((balance, index) => balance - balancesBefore[index])

    expect(claimedAmounts).toEqual(amounts)
  })
})
