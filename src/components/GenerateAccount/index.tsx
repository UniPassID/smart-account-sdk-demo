import "./index.css";
import { SmartAccount } from "@unipasswallet/smart-account";
import { Environment } from "@unipasswallet/smart-account-utils";
import { BigNumber } from "ethers";
import { useState } from "react";
import ReactLoading from "react-loading";
import { NFTContractAddress, mintNFTFunctionData } from "../../utils/contract";


function GenerateAccount (props: any) {
  const [address, setAddress] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const generateAccount = async function () {
    setLoading(true)
    const smartAccount = new SmartAccount({
      // !Attention: The rpcUrl should be replaced with your RPC node address.
      rpcUrl: "https://node.wallet.unipass.id/eth-mainnet",
      // rpcUrl: "https://endpoints.omniatech.io/v1/bsc/testnet/public",
      unipassServerUrl: 'https://d.wallet.unipass.vip/wallet-v2',
      masterKeySigner: props.signer!,
      env: Environment.Test,
      // !Attention: The appId should be replaced with the appId assigned to you.
      appId: "d891d3062f3f5252be137b4a0553ca83",
    });

    const account = await smartAccount.init();
    const address = await account.getAddress();
    const data = mintNFTFunctionData(address)
    console.log('data: ', data)
    const tx = {
      value: BigNumber.from(0),
      to: NFTContractAddress,
      data
    }
    console.log('tx', tx)
    const result = await account.simulateTransaction(tx)



    const response = await account.sendTransaction(tx)

    const receipt = await response.wait(30)

    console.log('receipt:', receipt)

    console.log('result: ', result)
    setLoading(false)
    setAddress(address);
  };

  const reset = () => {
    window.location.reload()
  };

  return (
    <>
      <h4 className="section-title"> 2. Generate UniPass Account. </h4>
      {loading ? (
        <ReactLoading type="bubbles" color="#8864ff" />
      ) : (
        <>
          {address ? (
            <>
            <div>UniPass address: {address}</div>
            <div className="retry-btn" onClick={reset}>
              Retry
            </div>
            </>
          ) : (
            <div className="btn-wrapper">
              <div className="metamask-btn" onClick={generateAccount}>
                Generate Account
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default GenerateAccount;
