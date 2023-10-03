import getHarvestParams from 'methods/vault/requests/getHarvestParams'
import { VoidSigner, JsonRpcProvider } from 'ethers'
import { configs } from 'helpers'

import { VaultAbi, KeeperAbi } from './types'


type VaultMulticallRequestInput = {
  params: Array<{
    method: string
    args?: any[]
  }>
  callStatic?: boolean
  estimateGas?: boolean
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
  const { params, callStatic, estimateGas } = request

  const calls: string[] = []

  const config = configs[options.network]
  const library = new JsonRpcProvider(config.network.url)

  const signer = new VoidSigner(userAddress, library)
  const signedContract = vaultContract.connect(signer)

  const [ harvestParams, canHarvest ] = await Promise.all([
    getHarvestParams({ options, vaultAddress }),
    keeperContract.canHarvest(vaultAddress),
  ])

  if (canHarvest) {
    const fragment = signedContract.interface.encodeFunctionData('updateState', [ harvestParams ])

    calls.push(fragment)
  }

  params.forEach(({ method, args }) => {
    // @ts-ignore: TS has limitations when dealing with overloads
    const fragment = signedContract.interface.encodeFunctionData(method, args)

    calls.push(fragment)
  })

  if (callStatic) {
    let result = await signedContract.multicall.staticCall(calls)

    if (canHarvest) {
      // Data from updateState not needed
      const [ _, ...rest ] = result

      result = rest
    }

    return result.map((data: any, index: number) => {
      const { method } = params[index]

      // @ts-ignore: TS has limitations when dealing with overloads
      return signedContract.interface.decodeFunctionResult(method, data)
    }) as T
  }

  return estimateGas
    ? signedContract.multicall.estimateGas(calls) as T
    : signedContract.multicall(calls) as T
}


export default vaultMulticall
