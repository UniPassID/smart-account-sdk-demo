import { GoogleLogin } from "@react-oauth/google";
import ReactLoading from "react-loading";
import {
  LocalStorage,
  UniPassJwtSigner,
} from "@unipasswallet/smart-account-signer";
import MetaMaskBtn from "../MetaMaskBtn";
import { useEffect, useState } from "react";
import { Signer } from "ethers";
import Web3AuthBtn from "../Web3AuthBtn";
import "./index.css"

function InitSigner(props: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [jwtSigner, setJwtSigner] = useState<Signer>();
  const initUniPassJwtSigner = async function (idToken?: string) {
    try {
      const uniPassJwtSigner = new UniPassJwtSigner({
        // !Attention: The appId should be replaced with the appId assigned to you.
        appId: "ce3feaa41d725a018f75b165a8ee528d",
        idToken,
        storage: LocalStorage,
      });
      const signer = await uniPassJwtSigner.init();
      setJwtSigner(signer);
      return signer
    } catch(e) {
      console.error(e)
    }
  };

  const initSigner = (signer: Signer) => {
    props.onCreateSigner(signer);

    setLoading(false);
    setSuccess(true);
  };

  useEffect(() => {
    initUniPassJwtSigner();
  }, []);

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
                  <li>
                    {" "}
                    Get UniPassJwt Signer by Web3Auth through Google OAuth.{" "}
                  </li>
                </ul>
                <div className="btn-wrapper">
                  {jwtSigner ? (
                    <div className="signer-btn" onClick={() => {
                      initSigner(jwtSigner)
                    }}>
                      <div className="signer-icon jwt-icon"/> Connect JwtSigner </div>
                  ) : (
                    <GoogleLogin
                      onSuccess={async (credentialResponse) => {
                        setLoading(true)
                        const signer = await initUniPassJwtSigner(credentialResponse.credential!);
                        setLoading(false)
                        signer && initSigner(signer)
                      }}
                      onError={() => {
                        console.log("Login Failed");
                      }}
                    />
                  )}
                </div>
                <ul>
                  <li> Get MetaMask Signer </li>
                </ul>
                <div className="btn-wrapper">
                  <MetaMaskBtn onCreateSigner={initSigner} />
                </div>
                <ul>
                  <li> Get Web3Auth Signer </li>
                </ul>
                <div className="btn-wrapper">
                  <Web3AuthBtn onCreateSigner={initSigner} />
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
