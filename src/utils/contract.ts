import { Contract, providers, utils } from "ethers";
import ABI from "./ABI.json";
import usdcAbi from "./USDCABI.json";
import { FeeOption } from "@unipasswallet/smart-account";

export const NFTContractAddress = "0xfcA06E29aD259D4cB61e64348abA17DbB3Da941A";
export const USDCAddress = "0x64544969ed7EBf5f083679233325356EbE738930";
const RPC_URL = "https://node.wallet.unipass.id/bsc-testnet";
// const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const provider = new providers.JsonRpcProvider(RPC_URL);
const NFTContract = new Contract(
  utils.getAddress(NFTContractAddress),
  ABI,
  provider
);
const usdcContract = new Contract(USDCAddress, usdcAbi, provider);

export interface FormattedFeeOption extends FeeOption {
  // symbol: string;
  value: string;
}

export function mintNFTFunctionData(address: string) {
  return NFTContract.interface.encodeFunctionData("mintNFT", [address]);
}

export function transferFunctionData(address: string) {
  const amountToSend = utils.parseUnits("0.001", 6);
  return usdcContract.interface.encodeFunctionData("transfer", [
    utils.getAddress(address),
    amountToSend,
  ]);
}

export async function getBalance(address: string): Promise<string> {
  const balance = await usdcContract.balanceOf(utils.getAddress(address));
  return utils.formatEther(balance);
}

export function tokenFormatter(feeOption: FeeOption): FormattedFeeOption {
  return {
    ...feeOption,
    value: utils.formatEther(feeOption.amount),
  };
}
