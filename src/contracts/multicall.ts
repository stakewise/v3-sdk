import type { MulticallAbi } from './types'


type Params = {
  mock?: any
  args: any[]
  contract: any
  methodName: string
  returnName: string
  noContractValue: any
}

export type Output = <T extends object>(params: Params[]) => () => Promise<T>

const multicall = (multicallContract: MulticallAbi): Output => {
  return (<T extends unknown>(params: Params[]) => {
    let index = 0

    const { calls, items } = params.reduce<{
      calls: Array<{ target: string, callData: string }>
      items: Array<Params & { realIndex?: number }>
    }>((acc, item) => {
      if (item.mock !== undefined || !item.contract) {
        acc.items.push(item)
      }
      else {
        const { contract, methodName, args } = item

        acc.calls.push({
          target: String(contract.target),
          callData: contract.interface.encodeFunctionData(methodName, args),
        })

        acc.items.push({
          ...item,
          realIndex: index++,
        })
      }

      return acc
    }, { calls: [], items: [] })

    return () => multicallContract.aggregate(calls)
      .then((result) => {
        return items.reduce<{ [key: string]: any }>((acc, item) => {
          const { contract, methodName, mock, noContractValue, returnName, realIndex } = item

          if (acc[returnName]) {
            throw new Error('Need to use unique "returnName" with "multicall" handler!')
          }

          if (mock !== undefined) {
            acc[returnName] = mock
          }
          else if (!contract) {
            acc[returnName] = noContractValue
          }
          else {
            const data = result.returnData[realIndex as number]
            const decodeData = contract.interface.decodeFunctionResult(methodName, data)

            acc[returnName] = decodeData.length === 1 ? decodeData[0] : decodeData
          }

          return acc
        }, {})
      }) as Promise<T>
  })
}


export default multicall
