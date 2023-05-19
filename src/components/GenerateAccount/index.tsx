import "./index.css";
import { SmartAccount, Environment } from "@unipasswallet/smart-account";
import { useState } from "react";
import ReactLoading from "react-loading";

function GenerateAccount (props: any) {
  const [address, setAddress] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const generateAccount = async function () {
    setLoading(true)
    const smartAccount = new SmartAccount({
      rpcUrl: "https://node.wallet.unipass.id/eth-mainnet",
      masterKeySigner: props.signer!,
      env: Environment.Dev,
      appId: "d891d3062f3f5252be137b4a0553ca83",
    });

    const account = await smartAccount.init();
    const address = await account.getAddress();
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
