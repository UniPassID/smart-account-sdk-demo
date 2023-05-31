import { SmartAccount } from "@unipasswallet/smart-account";
import { BigNumber } from "ethers";
import {
  FormattedFeeOption,
  USDCAddress,
  getBalance,
  tokenFormatter,
  transferFunctionData,
} from "../../utils/contract";
import { useEffect, useState } from "react";
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

  const simulateTx = async () => {
    setFeeOptions([]);
    setTransactionHash("");
    setLoading(true);
    const address = await account.getAddress();
    const data = transferFunctionData(address);
    const tx = {
      value: BigNumber.from(0),
      to: address,
      data,
    };
    const { availableFeeOptions = [], unavailableFeeOptions = [] } =
      await account.simulateTransaction(tx);

    console.log("availableFeeOptions: ", availableFeeOptions);
    console.log("unavailableFeeOptions: ", unavailableFeeOptions);

    const formattedToken = [...availableFeeOptions, ...unavailableFeeOptions].map(option => tokenFormatter(option))

    setFeeOptions(formattedToken);

    setLoading(false);
  };

  const sendTx = async () => {
    setTxLoading(true);
    const address = await account.getAddress();
    const data = transferFunctionData(address);
    const tx = {
      value: BigNumber.from(0),
      to: address,
      data,
    };

    const usdcFeeOption = feeOptions.find((feeOption) => {
      console.log(
        "feeOption.token: ",
        feeOption.token,
        USDCAddress,
        feeOption.token.toLowerCase() === USDCAddress
      );
      return feeOption.token.toLowerCase() === USDCAddress.toLowerCase();
    });

    console.log("usdcFeeOption: ", usdcFeeOption);

    if (usdcFeeOption) {
      const response = await account.sendTransaction(tx, {
        fee: usdcFeeOption,
      });
      console.log("response: ", response);
      const receipt = await response.wait(30);
      console.log("receipt: ", receipt);
      setTransactionHash(receipt.transactionHash);
      setTxLoading(false);
    }
  };

  const fetchBalance = async () => {
    const address = await account.getAddress();
    const balance = await getBalance(address);
    setBalance(balance);
  };

  useEffect(() => {
    const int = setInterval(() => {
      fetchBalance();
    }, 3000);
    return () => {
      clearInterval(int);
    };
  }, []);

  return (
    <>
      <h4 className="section-title">
        - Send transactions and pay gas with USDC
      </h4>
      <div>
        Let's experience how to send a transaction when user only have USDC. You
        can claim test USDC token{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://testnet.binance.org/faucet-smart/"
        >
          here
        </a>
        .
      </div>
      <div className="section-content">
        {" "}
        Your USDC Balance: <b>{balance}</b>
      </div>
      <div>
        First, we need to generate a transaction and estimate the gas fee
        required. We will construct a transaction to transfer 0.1 USDC to
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
            { feeOptions.map(option => <div>{option.symbol}: {option.error? 'Unavailable' : option.value}</div>)}
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
    </>
  );
}

export default SendTx;
