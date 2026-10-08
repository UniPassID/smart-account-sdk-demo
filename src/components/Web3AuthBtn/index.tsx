import { Signer, providers } from 'ethers';
import { Web3Auth } from "@web3auth/modal";

const Web3AuthClientId = process.env.REACT_APP_WEB3AUTH_CLIENT_ID || ""

interface Web3AuthBtnProps {
  onCreateSigner: (signer: Signer) => void
}
function Web3AuthBtn(props: Web3AuthBtnProps) {
  const initSigner = async function () {
    const web3auth = new Web3Auth({
      clientId: Web3AuthClientId,
      chainConfig: {
        chainNamespace: 'eip155',
        chainId: '5',
        rpcTarget: 'https://node.wallet.unipass.id/eth-goerli'
      },
      web3AuthNetwork: 'testnet'
    })
    await web3auth.initModal()
    const web3authProvider = await web3auth.connect()
    if (web3authProvider) {
      const provider = new providers.Web3Provider(web3authProvider as providers.ExternalProvider)
      const signer = provider.getSigner()
      props.onCreateSigner(signer)
    }
  };

  if (!Web3AuthClientId) {
    return (
      <p role="status">
        Set REACT_APP_WEB3AUTH_CLIENT_ID in .env.local to enable Web3Auth.
      </p>
    );
  }

  return (
    <div className="signer-btn" onClick={initSigner}>
      <div className="signer-icon web3auth-icon"/> Connect Web3Auth </div>
  );
}

export default Web3AuthBtn;
