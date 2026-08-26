import { ContractAbi, MulticallParameter } from '../types'


type Input = {
  multicallParams: MulticallParameter[]
  contract: ContractAbi
}

const getMulticallCalls = ({ multicallParams, contract }: Input) => {
  return multicallParams.map(({ method, args }) => {
    // @ts-ignore: TS has limitations when dealing with overloads
    return contract.interface.encodeFunctionData(method, args)
  })
}


export default getMulticallCalls
