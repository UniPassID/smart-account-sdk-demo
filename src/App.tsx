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
import { ChainConfig } from "./utils/contract";

const GoogleClientId =
  "1076249686642-g0d42524fhdirjeho0t6n3cjd7pulmns.apps.googleusercontent.com";

function App() {
  const [signer, setSigner] = useState<UniPassJwtSigner | Signer | undefined>();
  const [account, setAccount] = useState<SmartAccount | undefined>();
  const [activeChain, setActiveChain] = useState<number>(97);

  const reset = () => {
    window.location.reload();
  };

  const handleSwitchChain = async (event: any) => {
    const chainId = parseInt(event.target.value);
    await account?.switchChain(chainId);
    setActiveChain(chainId);
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
              <div className="active-chain">
                Active Chain:
                <select onChange={handleSwitchChain}>
                  {ChainConfig.map((chain) => (
                    <option value={chain.chainId}>{chain.name}</option>
                  ))}
                </select>
              </div>
              {activeChain === 97 && (
                <section
                  className="feat-section"
                  style={{ marginBottom: "20px" }}
                >
                  <MintNFT account={account} />
                </section>
              )}
              <section className="feat-section">
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
