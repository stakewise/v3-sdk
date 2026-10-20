import { describe, expect, vi } from 'vitest'
import { VoidSigner, JsonRpcProvider } from 'ethers'

import { it, rpcUrl, userAddress, vaultAddress } from '../../../../test'

import { Network } from '../../../helpers'

import getSignedContract from './getSignedContract'
import type { MulticallRequestInput } from '../types'


type Case = {
  name: string
  request: MulticallRequestInput
}

const signedCases: Case[] = [
  { name: 'send with provider', request: { params: [] } },
  { name: 'estimateGas', request: { params: [], estimateGas: true } },
]

const unsignedCases: Case[] = [
  { name: 'callStatic', request: { params: [], callStatic: true } },
  { name: 'transactionData', request: { params: [], transactionData: true } },
]

describe('getSignedContract', () => {

  it.for(signedCases)('$name', async ({ request }, { sdk, runner, vaultContract }) => {
    const getSigner = vi.spyOn(runner.provider, 'getSigner')

    const signedContract = await getSignedContract({
      contract: vaultContract,
      userAddress,
      options: sdk.options,
      request,
    })

    const [ signer, address ] = await Promise.all([
      getSigner.mock.results[0].value,
      signedContract.getAddress(),
    ])

    expect(getSigner).toHaveBeenCalledWith(userAddress)
    expect(signedContract).not.toBe(vaultContract)
    expect(signedContract.runner).toBe(signer)
    expect(address).toBe(vaultAddress)
  })

  it('send without provider', async ({ vaultContract }) => {
    const signedContract = await getSignedContract({
      contract: vaultContract,
      userAddress,
      options: { network: Network.Mainnet, endpoints: { web3: rpcUrl } },
      request: { params: [] },
    })

    const signer = signedContract.runner as VoidSigner
    const address = await signedContract.getAddress()

    expect(signer).toBeInstanceOf(VoidSigner)
    expect(signer.address).toBe(userAddress)
    expect(signer.provider).toBeInstanceOf(JsonRpcProvider)
    expect(address).toBe(vaultAddress)
  })

  it.for(unsignedCases)('$name', async ({ request }, { sdk, runner, vaultContract }) => {
    const getSigner = vi.spyOn(runner.provider, 'getSigner')

    const signedContract = await getSignedContract({
      contract: vaultContract,
      userAddress,
      options: sdk.options,
      request,
    })

    expect(signedContract).toBe(vaultContract)
    expect(getSigner).not.toHaveBeenCalled()
  })
})
