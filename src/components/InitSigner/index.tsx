import { GoogleLogin } from "@react-oauth/google";
import ReactLoading from "react-loading";
import {
  Web3AuthSigner,
} from "@unipasswallet/smart-account-signer";
import { Environment } from "@unipasswallet/smart-account";
import "./index.css";
import MetaMaskBtn from "../MetaMaskBtn";
import { useState } from "react";
import { Signer } from "ethers";

function InitSigner(props: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const initWeb3Signer = async function (idToken: string) {
    setLoading(true)
    const startTime = Date.now()
    console.log('Begin to init Web3Signer ', startTime)
    const web3AuthSigner = new Web3AuthSigner({
      appId: "d891d3062f3f5252be137b4a0553ca83",
      idToken,
      env: Environment.Dev,
    });
    const signer = await web3AuthSigner.init();

    const endTime = Date.now()
    console.log('Finish ', endTime)
    console.log(`Duration:  ${endTime - startTime}ms`)
    props.onCreateSigner(signer);

    setLoading(false)
    setSuccess(true);

  };

  const initMetaMaskSigner = (signer: Signer) => {
    props.onCreateSigner(signer);

    setLoading(false)
    setSuccess(true);
  }

  return (
    <>
      <h4 className="section-title">
        1. Firstly, You need to initialize a Signer for generating UniPass
        Account.
      </h4>
      <>
        {loading ? (
          <ReactLoading type="bubbles" color="#8864ff" />
        ) : (
          <>
            {success ? (
              <div> Create Signer successful </div>
            ) : (
              <>
                <ul>
                  <li> Create Web3Auth Signer by GoogleOAuth. </li>
                </ul>
                <div className="btn-wrapper">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      initWeb3Signer(credentialResponse.credential!);
                    }}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                  />
                </div>
                <ul>
                  <li> Get MetaMask Signer </li>
                </ul>
                <div className="btn-wrapper">
                  <MetaMaskBtn
                    onCreateSigner={initMetaMaskSigner}
                  />
                </div>
              </>
            )}
          </>
        )}
      </>
    </>
  );
}

export default InitSigner;
