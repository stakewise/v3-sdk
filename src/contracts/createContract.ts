import { Contract } from 'ethers'
import type { Provider, InterfaceAbi } from 'ethers'


const createContract = <T extends unknown>(
  address: string,
  abi: InterfaceAbi,
  library: Provider
) : T => {
  const contract = new Contract(address, abi, library) as T

  return contract
}


export default createContract
