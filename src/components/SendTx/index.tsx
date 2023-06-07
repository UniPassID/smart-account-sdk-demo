import { SmartAccount } from "@unipasswallet/smart-account";
import { BigNumber, utils } from "ethers";
import {
  ChainConfig,
  FormattedFeeOption,
  getBalance,
  tokenFormatter,
  transferFunctionData,
} from "../../utils/contract";
import { useCallback, useEffect, useState } from "react";
import ReactLoading from "react-loading";

interface SendTxProps {
  account: SmartAccount;
}

function SendTx(props: SendTxProps) {
  const account = props.account;
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<string>("");
  const [feeOptions, setFeeOptions] = useState<FormattedFeeOption[]>([]);
  const [error, setError] = useState<unknown>("");

  const simulateTx = async () => {
    try {
      setFeeOptions([]);
      setTransactionHash("");
      setLoading(true);
      setError(null);
      const address = await account.getAddress();
      const currentChain = ChainConfig.find(chain => chain.chainId === account.getChainId())
      const data = transferFunctionData(address, currentChain!);
      const tx = {
        value: BigNumber.from(0),
        to: utils.getAddress(currentChain!.usdcContractAddress),
        data,
      };
      const { feeOptions = []} =
        await account.simulateTransaction(tx);

      const formattedToken = feeOptions.map((option) => tokenFormatter(option));

      setFeeOptions(formattedToken);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  const sendTx = async () => {
    setTxLoading(true);
    const address = await account.getAddress();
    const currentChain = ChainConfig.find(chain => chain.chainId === account.getChainId())
    const data = transferFunctionData(address, currentChain!);
    const tx = {
      value: BigNumber.from(0),
      to: utils.getAddress(currentChain!.usdcContractAddress),
      data,
    };

    const usdcFeeOption = feeOptions.find((feeOption) => {
      return feeOption.token.toLowerCase() === currentChain!.usdcContractAddress.toLowerCase();
    });

    try {
      if (usdcFeeOption) {
        const response = await account.sendTransaction(tx, {
          fee: usdcFeeOption,
        });
        const receipt = await response.wait(30);
        setTransactionHash(receipt.transactionHash);
      }
    } catch (e) {
      setError(e || "Something wrong");
    }
    setTxLoading(false);
  };

  const fetchBalance = useCallback(async () => {
    const address = await account.getAddress();
    const currentChain = ChainConfig.find(chain => chain.chainId === account.getChainId())
    if (currentChain) {
      const balance = await getBalance(address, currentChain!);
      setBalance(balance);
    }
  }, [account]);

  useEffect(() => {
    const int = setInterval(() => {
      fetchBalance();
    }, 3000);
    return () => {
      clearInterval(int);
    };
  }, [fetchBalance]);

  return (
    <>
      <h4 className="section-title">
        - Send transactions and pay gas with USDC
      </h4>
      <div>
        Let's experience how to send a transaction when user only have USDC.
      </div>
      <div className="section-content">
        {" "}
        Your USDC Balance: <b>{balance}</b>
      </div>
      <div>
        First, we need to generate a transaction and estimate the gas fee
        required. We will construct a transaction to transfer 0.001 USDC to
        another address.
      </div>
      {loading ? (
        <ReactLoading type="bubbles" color="#8864ff" />
      ) : (
        <div className="up-btn" onClick={simulateTx}>
          Generate transaction
        </div>
      )}
      {feeOptions.length > 0 && (
        <>
          <div>The gas fee options required for this transaction:</div>
          <div className="section-content">
            {feeOptions.map((option) => (
              <div key={option.name}>
                {option.symbol}: {option.value}{" "}
                {option.error && "(Unavailable)"}
              </div>
            ))}
          </div>
          <div>
            Second, let's send the transaction and choose to pay the gas fee
            with USDC.
          </div>
          {txLoading ? (
            <ReactLoading type="bubbles" color="#8864ff" />
          ) : (
            <div className="up-btn" onClick={sendTx}>
              Send Transaction
            </div>
          )}

          {transactionHash && (
            <div>
              Congratulations! The transaction was sent successfully. You can
              view this{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://testnet.bscscan.com/tx/${transactionHash}`}
              >
                transaction
              </a>{" "}
              in the explorer.
            </div>
          )}
        </>
      )}
      {error && <div className="error-msg">{error.toString()}</div>}
    </>
  );
}

export default SendTx;
