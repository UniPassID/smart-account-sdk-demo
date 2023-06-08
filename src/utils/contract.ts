import { Contract, providers, utils } from "ethers";
import ABI from "./ABI.json";
import usdcAbi from "./USDCABI.json";
import { FeeOption } from "@unipasswallet/smart-account";

export const NFTContractAddress = "0xfcA06E29aD259D4cB61e64348abA17DbB3Da941A";

export interface ChainConfigI {
  name: string
  chainId: number
  rpcUrl: string
  usdcContractAddress: string
  decimal?: number
  explorer?: string
}

export const ChainConfig: ChainConfigI[] = [
  {
    // bsc-testnet
    name: "bsc-testnet",
    chainId: 97,
    rpcUrl: "https://node.wallet.unipass.id/bsc-testnet",
    usdcContractAddress: "0x64544969ed7EBf5f083679233325356EbE738930",
    decimal: 18,
    explorer: "https://testnet.bscscan.com",
  },
  {
    // avax-mainnet
    name: "avax-mainnet",
    chainId: 43114,
    rpcUrl: "https://node.wallet.unipass.id/avalanche-mainnet",
    usdcContractAddress: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    explorer: "https://snowtrace.io",
  },
  {
    // polygon-mainnet
    name: "polygon-mainnet",
    chainId: 137,
    rpcUrl: "https://node.wallet.unipass.id/polygon-mainnet",
    usdcContractAddress: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    explorer: "https://polygonscan.com",
  },
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

export function transferFunctionData(
  address: string,
  chainConfig: ChainConfigI
) {
  const amountToSend = utils.parseUnits("0.01", chainConfig.decimal || 6);
  const provider = new providers.JsonRpcProvider(chainConfig.rpcUrl);
  const usdcContract = new Contract(
    utils.getAddress(chainConfig.usdcContractAddress),
    usdcAbi,
    provider
  );

  return usdcContract.interface.encodeFunctionData("transfer", [
    utils.getAddress(address),
    amountToSend,
  ]);
}

export async function getBalance(
  address: string,
  chainConfig: ChainConfigI
): Promise<string> {
  const provider = new providers.JsonRpcProvider(chainConfig.rpcUrl);
  const usdcContract = new Contract(
    utils.getAddress(chainConfig.usdcContractAddress),
    usdcAbi,
    provider
  );
  const balance = await usdcContract.balanceOf(utils.getAddress(address));
  return utils.formatUnits(balance, chainConfig.decimal || 6);
}

export function tokenFormatter(feeOption: FeeOption): FormattedFeeOption {
  return {
    ...feeOption,
    value: utils.formatUnits(feeOption.amount, feeOption.decimals),
  };
}
