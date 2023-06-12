import { Signer, providers } from 'ethers';

interface MetaMaskBtnProps {
  onCreateSigner: (signer: Signer) => void
}
function MetaMaskBtn(props: MetaMaskBtnProps) {
  const initSigner = async function () {
    if (window.ethereum) {
      const provider = new providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const signer = provider.getSigner()
      props.onCreateSigner(signer)
    }
  };

  return (
    <div className="signer-btn" onClick={initSigner}>
      <div className="signer-icon metamask-icon"/> Connect MetaMask </div>
  );
}

export default MetaMaskBtn;
