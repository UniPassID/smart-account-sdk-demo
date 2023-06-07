import { Contract, providers, utils } from "ethers";
import ABI from "./ABI.json";
import usdcAbi from "./USDCABI.json";
import { FeeOption } from "@unipasswallet/smart-account";

export const NFTContractAddress = "0xfcA06E29aD259D4cB61e64348abA17DbB3Da941A";

interface ChainConfigI {
  name: string
  chainId: number,
  rpcUrl: string,
  usdcContractAddress: string
}

export const ChainConfig: ChainConfigI[] = [
  {
    // bsc-testnet
    name: 'bsc-testnet',
    chainId: 97,
    rpcUrl: "https://node.wallet.unipass.id/bsc-testnet",
    usdcContractAddress: "0x64544969ed7EBf5f083679233325356EbE738930"
  },
  {
    // avax-mainnet
    name: 'avax-mainnet',
    chainId: 43114,
    rpcUrl: "https://node.wallet.unipass.id/avalanche-mainnet",
    usdcContractAddress: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664"
  }, 
  {
    // polygon-mainnet
    name: 'polygon-mainnet',
    chainId: 137,
    rpcUrl: "https://node.wallet.unipass.id/polygon-mainnet",
    usdcContractAddress: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"
  },
  {
    name: 'arbitrum-mainnet',
    chainId: 42161,
    rpcUrl: "https://node.wallet.unipass.id/arbitrum-mainnet",
    usdcContractAddress: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8"
  }
];

const RPC_URL = "https://node.wallet.unipass.id/bsc-testnet";
const provider = new providers.JsonRpcProvider(RPC_URL);
const NFTContract = new Contract(
  utils.getAddress(NFTContractAddress),
  ABI,
  provider
);

export interface FormattedFeeOption extends FeeOption {
  // symbol: string;
  value: string;
}

export function mintNFTFunctionData(address: string) {
  return NFTContract.interface.encodeFunctionData("mintNFT", [address]);
}

export function transferFunctionData(address: string, chainConfig: ChainConfigI) {
  const amountToSend = utils.parseEther("0.01");
  const provider = new providers.JsonRpcProvider(chainConfig.rpcUrl)
  const usdcContract = new Contract(utils.getAddress(chainConfig.usdcContractAddress), usdcAbi, provider);

  return usdcContract.interface.encodeFunctionData("transfer", [
    utils.getAddress(address),
    amountToSend,
  ]);
}

export async function getBalance(address: string, chainConfig: ChainConfigI): Promise<string> {
  const provider = new providers.JsonRpcProvider(chainConfig.rpcUrl)
  const usdcContract = new Contract(utils.getAddress(chainConfig.usdcContractAddress), usdcAbi, provider);
  const balance = await usdcContract.balanceOf(utils.getAddress(address));
  return utils.formatEther(balance);
}

export function tokenFormatter(feeOption: FeeOption): FormattedFeeOption {
  return {
    ...feeOption,
    value: utils.formatEther(feeOption.amount),
  };
}
