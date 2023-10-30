import { Contract } from 'ethers'
import type { Provider, InterfaceAbi } from 'ethers'


const createContract = <T extends unknown>(
  address: string,
  abi: InterfaceAbi,
  library: Provider
): T => new Contract(address, abi, library) as T


export default createContract
