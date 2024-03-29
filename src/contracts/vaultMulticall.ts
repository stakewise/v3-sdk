import { VoidSigner } from 'ethers'

import { createProvider } from '../utils'
import { VaultAbi, OtherTokenVaultAbi, KeeperAbi } from './types'
import getHarvestParams from '../methods/vault/requests/getHarvestParams'


type VaultMulticallRequestInput = {
  params: Array<{
    method: string
    args?: any[]
  }>
  callStatic?: boolean
  estimateGas?: boolean
  transactionData?: boolean
}

type VaultMulticallInput = {
  userAddress: string
  vaultAddress: string
  keeperContract: KeeperAbi
  options: StakeWise.Options
  request: VaultMulticallRequestInput
  vaultContract: VaultAbi | OtherTokenVaultAbi
}

// Methods with _checkHarvested() call
const harvestCheckMethods = [
  'deposit',
  'mintOsToken',
  'enterExitQueue',
  'setFeeRecipient',
  'claimExitedAssets',
]

const vaultMulticall = async <T extends unknown>(values: VaultMulticallInput): Promise<T> => {
  const { options, vaultAddress, userAddress, request, vaultContract, keeperContract } = values
  const { params, callStatic, estimateGas, transactionData } = request

  const calls: string[] = []

  let contract = vaultContract

  const withSigner = !callStatic && !transactionData

  if (withSigner) {
    const library = options.provider || createProvider(options)

    const signer = options.provider
      ? await options.provider.getSigner(userAddress)
      : new VoidSigner(userAddress, library)

    contract = vaultContract.connect(signer)
  }

  let canHarvest = false

  const needHarvest = params.some(({ method }) => harvestCheckMethods.includes(method))

  if (needHarvest) {
    const [ harvestParams ] = await Promise.all([
      getHarvestParams({ options, vaultAddress }),
      keeperContract.canHarvest(vaultAddress).then((value) => canHarvest = value),
    ])

    if (canHarvest) {
      const fragment = contract.interface.encodeFunctionData('updateState', [ harvestParams ])

      calls.push(fragment)
    }
  }

  params.forEach(({ method, args }) => {
    // @ts-ignore: TS has limitations when dealing with overloads
    const fragment = contract.interface.encodeFunctionData(method, args)

    calls.push(fragment)
  })

  if (callStatic) {
    let result = await contract.multicall.staticCall(calls, { from: userAddress })

    if (canHarvest) {
      // Data from updateState not needed
      const [ _, ...rest ] = result

      result = rest
    }

    return result.map((data: any, index: number) => {
      const { method } = params[index]

      // @ts-ignore: TS has limitations when dealing with overloads
      return contract.interface.decodeFunctionResult(method, data)
    }) as T
  }

  // If we don't need to update a vault state, we can just call the method, no multicall. This will save the user gas
  const isSoloCall = calls.length === 1 && params.length === 1

  if (estimateGas) {
    if (isSoloCall) {
      const { method, args } = params[0]

      // @ts-ignore: no types to describe
      return contract[method].estimateGas(...args)
    }

    return contract.multicall.estimateGas(calls) as T
  }

  if (transactionData) {
    const rx = await contract.multicall.populateTransaction(calls)

    return {
      to: rx.to,
      data: rx.data,
    } as T
  }

  // Even though ethers tries to find the best price for gas, sometimes it's
  // not enough and the transaction breaks down and users lose money for gas.
  // Adding 10% to the gas limit

  if (isSoloCall) {
    const { method, args } = params[0]

    // @ts-ignore: no types to describe
    const estimatedGas = await contract[method].estimateGas(...args)
    const gasLimit = estimatedGas * 110n / 100n

    // @ts-ignore: no types to describe
    return contract[method](...args, { gasLimit })
  }

  const estimatedGas = await contract.multicall.estimateGas(calls)
  const gasLimit = estimatedGas * 110n / 100n

  return contract.multicall(calls, { gasLimit }) as T
}


export default vaultMulticall
