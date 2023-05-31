import { SmartAccount } from "@unipasswallet/smart-account";
import { BigNumber } from "ethers";
import { NFTContractAddress, mintNFTFunctionData } from "../../utils/contract";
import { useState } from "react";
import ReactLoading from "react-loading";

interface MintNFTProps {
  account: SmartAccount;
}

function MintNFT(props: MintNFTProps) {
  const account = props.account;
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const startMint = async () => {
    setTransactionHash("");
    setLoading(true);
    const address = await account.getAddress();
    const data = mintNFTFunctionData(address);
    const tx = {
      value: BigNumber.from(0),
      to: NFTContractAddress,
      data,
    };
    const response = await account.sendTransaction(tx);
    const receipt = await response.wait(30);

    setLoading(false);
    setTransactionHash(receipt.transactionHash);
  };

  return (
    <>
      <h4 className="section-title">- Mint an NFT with 0 gas</h4>
      <div>
        We have configured the{" "}
        <i>{" "} mintNFT(address _recipient) {" "}</i>{" "}method of the{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://testnet.bscscan.com/address/${NFTContractAddress}/`}
        >
          {" "}
          NFT Contract
        </a>{" "}
        to be paid by the application. Therefore, when users call this NFT mint
        method, they don't need to pay for gas.
      </div>
      {loading ? (
        <ReactLoading type="bubbles" color="#8864ff" />
      ) : (
        <div className="up-btn" onClick={startMint}>
          Mint NFT
        </div>
      )}
      {transactionHash && (
        <div>
          {" "}
          Congratulations! You have minted an NFT with 0 gas. You can view this{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://testnet.bscscan.com/tx/${transactionHash}`}
          >
            transaction
          </a>{" "}
          in explorer.
        </div>
      )}
    </>
  );
}

export default MintNFT;
