import { parseEther } from 'ethers'


const getWeiString = (value: number | string) => parseEther(String(value)).toString()


export default getWeiString
