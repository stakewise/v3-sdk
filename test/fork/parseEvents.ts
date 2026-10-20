import { getAddress } from 'ethers'
import type { BaseContract, TransactionReceipt } from 'ethers'


const parseEvents = async (contract: BaseContract, receipt: TransactionReceipt | null) => {
  const address = getAddress(await contract.getAddress())

  return (receipt?.logs || [])
    .filter((log) => log.address === address)
    .map((log) => contract.interface.parseLog(log))
}


export default parseEvents
