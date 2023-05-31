import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import { Signer } from "ethers";
import { UniPassJwtSigner } from "@unipasswallet/smart-account-signer";
import InitSigner from "./components/InitSigner";
import GenerateAccount from "./components/GenerateAccount";
import Header from "./components/Header";
import MintNFT from "./components/MintNFT";
import "./App.css";
import { SmartAccount } from "@unipasswallet/smart-account";
import SendTx from "./components/SendTx";

const GoogleClientId =
  "463402777513-skhs1og4clv62qr04dk64icgms5keql6.apps.googleusercontent.com";

function App() {
  const [signer, setSigner] = useState<UniPassJwtSigner | Signer | undefined>();
  const [account, setAccount] = useState<SmartAccount | undefined>();

  const reset = () => {
    window.location.reload();
  };

  return (
    <GoogleOAuthProvider clientId={GoogleClientId}>
      <div className="App">
        <Header />
        <div className="content">
          <section className="step-1">
            <InitSigner onCreateSigner={setSigner} />
          </section>
          <section className="step-2">
            {signer && (
              <GenerateAccount signer={signer} onCreateAccount={setAccount} />
            )}
          </section>
          {account && (
            <>
              <h4 className="title">
                Congratulations! We have successfully got UniPass Account
              </h4>
              <section>
                <MintNFT account={account} />
              </section>
              <section>
                <SendTx account={account} />
              </section>
            </>
          )}
        </div>
        <div className="bottom">
          <div className="up-btn" onClick={reset}>
            Retry
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
