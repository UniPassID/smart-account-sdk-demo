import { SmartAccount } from "@unipasswallet/smart-account";
import { Environment } from "@unipasswallet/smart-account-utils";
import { Signer } from "ethers";
import { useState } from "react";
import ReactLoading from "react-loading";

interface GenerateAccountProps {
  signer: Signer;
  onCreateAccount: (account: SmartAccount) => void;
}

function GenerateAccount(props: GenerateAccountProps) {
  const [address, setAddress] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const generateAccount = async function () {
    setLoading(true);
    const smartAccount = new SmartAccount({
      // !Attention: The rpcUrl should be replaced with your RPC node address.
      rpcUrl: "https://node.wallet.unipass.id/bsc-testnet",
      unipassServerUrl: "https://d.wallet.unipass.vip/wallet-v2",
      masterKeySigner: props.signer!,
      env: Environment.Test,
      // !Attention: The appId should be replaced with the appId assigned to you.
      appId: "d891d3062f3f5252be137b4a0553ca83",
    });

    const account = await smartAccount.init();

    props.onCreateAccount(account);

    const address = await account.getAddress();

    setLoading(false);
    setAddress(address);
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
            </>
          ) : (
            <div className="up-btn" onClick={generateAccount}>
              Generate Account
            </div>
          )}
        </>
      )}
    </>
  );
}

export default GenerateAccount;
