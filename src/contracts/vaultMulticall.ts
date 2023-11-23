import { VoidSigner, JsonRpcProvider } from 'ethers'

import { configs } from '../utils'
import { VaultAbi, KeeperAbi } from './types'
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
  vaultContract: VaultAbi
  keeperContract: KeeperAbi
  options: StakeWise.Options
  request: VaultMulticallRequestInput
}

const vaultMulticall = async <T extends unknown>(values: VaultMulticallInput): Promise<T> => {
  const { options, vaultAddress, userAddress, request, vaultContract, keeperContract } = values
  const { params, callStatic, estimateGas, transactionData } = request

  const calls: string[] = []

  let contract = vaultContract

  const withSigner = !callStatic && !transactionData

  if (withSigner) {
    const config = configs[options.network]
    const library = options.provider || new JsonRpcProvider(config.network.url)

    const signer = options.provider
      ? await library.getSigner(userAddress)
      : new VoidSigner(userAddress, library)

    contract = vaultContract.connect(signer)
  }

  const [ harvestParams, canHarvest ] = await Promise.all([
    getHarvestParams({ options, vaultAddress }),
    keeperContract.canHarvest(vaultAddress),
  ])

  if (canHarvest) {
    const fragment = contract.interface.encodeFunctionData('updateState', [ harvestParams ])

    calls.push(fragment)
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

  if (estimateGas) {
    return contract.multicall.estimateGas(calls) as T
  }

  if (transactionData) {
    const rx = await contract.multicall.populateTransaction(calls)

    return {
      to: rx.to,
      data: rx.data,
    } as T
  }

  return contract.multicall(calls) as T
}


export default vaultMulticall
