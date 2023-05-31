import { Contract, providers } from 'ethers'
import ABI from './ABI.json'

export const NFTContractAddress = '0xfcA06E29aD259D4cB61e64348abA17DbB3Da941A'

const RPC_URL = 'https://endpoints.omniatech.io/v1/bsc/testnet/public'

const provider = new providers.JsonRpcProvider(RPC_URL)
const NFTContract = new Contract(NFTContractAddress, ABI, provider)

export function mintNFTFunctionData(address: string) {
  return NFTContract.interface.encodeFunctionData('mintNFT', [address])
}


