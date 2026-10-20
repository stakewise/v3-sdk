import { Contract, Interface } from 'ethers'
import type { BaseContract } from 'ethers'


const extendContract = <T extends BaseContract>(contract: T, abi: string[]) => {
  const fragments = [ ...contract.interface.fragments, ...new Interface(abi).fragments ]

  return new Contract(contract.target, fragments, contract.runner) as Contract & T
}


export default extendContract
