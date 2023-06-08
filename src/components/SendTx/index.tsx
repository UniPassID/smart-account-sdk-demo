import { SmartAccount } from "@unipasswallet/smart-account";
import { BigNumber, utils } from "ethers";
import {
  ChainConfig,
  ChainConfigI,
  FormattedFeeOption,
  getBalance,
  tokenFormatter,
  transferFunctionData,
} from "../../utils/contract";
import { useCallback, useEffect, useState } from "react";
import ReactLoading from "react-loading";

interface SendTxProps {
  account: SmartAccount;
  activeChain: number;
}

function SendTx(props: SendTxProps) {
  const account = props.account;
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<string>("");
  const [feeOptions, setFeeOptions] = useState<FormattedFeeOption[]>([]);
  const [error, setError] = useState<any>("");
  const [currentChain, setCurrentChain] = useState<ChainConfigI>();

  const reset = () => {
    setFeeOptions([]);
    setTransactionHash("");
    setError(null);
  };

  const simulateTx = async () => {
    if (!balance) return
    try {
      reset();
      setLoading(true);
      const address = await account.getAddress();
      const currentChain = ChainConfig.find(
        (chain) => chain.chainId === account.getChainId()
      );

      const usdcBalance = utils.parseUnits(balance, currentChain!.decimal || 6);
      const amountToSend = utils.parseUnits("0.01", currentChain!.decimal || 6);
      if (usdcBalance.lt(amountToSend)) {
        throw new Error("Your USDC balance is not enough.");
      }
      const data = transferFunctionData(address, currentChain!);
      const tx = {
        value: BigNumber.from(0),
        to: utils.getAddress(currentChain!.usdcContractAddress),
        data,
      };
      const { feeOptions = [] } = await account.simulateTransaction(tx);

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
    const currentChain = ChainConfig.find(
      (chain) => chain.chainId === account.getChainId()
    );
    setCurrentChain(currentChain);
    const data = transferFunctionData(address, currentChain!);
    const tx = {
      value: BigNumber.from(0),
      to: utils.getAddress(currentChain!.usdcContractAddress),
      data,
    };

    const usdcFeeOption = feeOptions.find((feeOption) => {
      return (
        feeOption.token.toLowerCase() ===
        currentChain!.usdcContractAddress.toLowerCase()
      );
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

  const fetchBalance = useCallback(
    async (chainId: number) => {
      const address = await account.getAddress();
      const chain = ChainConfig.find((chain) => chain.chainId === chainId);
      if (chain) {
        const balance = await getBalance(address, chain);
        setBalance(balance);
      }
      setTimeout(fetchBalance, 3000)
    },
    [account]
  );

  useEffect(() => {
    reset();
    setBalance("");
    fetchBalance(props.activeChain)
  }, [props.activeChain, fetchBalance]);

  return (
    <>
      <h4 className="section-title">
        - Send transactions and pay gas with USDC
      </h4>
      <div>
        Let's experience how to send a transaction when user only have USDC.
      </div>
      <div className="section-content" style={{ display: "flex" }}>
        {" "}
        Your USDC Balance:{" "}
        {balance ? (
          <b>{balance}</b>
        ) : (
          <ReactLoading
            width="20px"
            height="20px"
            type="bars"
            color="#8864ff"
          />
        )}
      </div>
      <div>
        First, we need to generate a transaction and estimate the gas fee
        required. We will construct a transaction to transfer 0.01 USDC to
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
                href={`${currentChain?.explorer}/tx/${transactionHash}`}
              >
                transaction
              </a>{" "}
              in the explorer.
            </div>
          )}
        </>
      )}
      {error && <div className="error-msg">{error.message}</div>}
    </>
  );
}

export default SendTx;
