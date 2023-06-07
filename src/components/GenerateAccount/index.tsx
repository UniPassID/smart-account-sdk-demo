import { SmartAccount } from "@unipasswallet/smart-account";
import { Signer } from "ethers";
import { useState } from "react";
import ReactLoading from "react-loading";
import { ChainConfig } from "../../utils/contract";

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
      chainOptions: ChainConfig,
      masterKeySigner: props.signer!,
      // !Attention: The appId should be replaced with the appId assigned to you.
      appId: "ce3feaa41d725a018f75b165a8ee528d",
    });

    const account = await smartAccount.init({ chainId: 97 });

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
