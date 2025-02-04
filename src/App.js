import './App.css';
import { ethers } from 'ethers'
import { useState } from 'react';
import TokenArtifact from "./artifacts/contracts/Turing.sol/Turing.json"

const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const localBlockchainAddress = 'http://localhost:8545'

function App() {

  const [tokenData, setTokenData] = useState({})
  const [voteAmount, setVoteAmount] = useState()
  const [codeName, setCodeName] = useState()
  

  const provider = new ethers.providers.JsonRpcProvider(localBlockchainAddress)

  const signer = provider.getSigner();

  async function _intializeContract(init) {
    const contract = new ethers.Contract(
      tokenAddress,
      TokenArtifact.abi,
      init
    );

    return contract
  }

  async function _getTokenData() {
    const contract = await _intializeContract(signer)
    const name = await contract.name();
    const symbol = await contract.symbol();
    const tokenData = { name, symbol }

    setTokenData(tokenData);
  }

  // async function getBalance() {
  //   if (typeof window.ethereum !== 'undefined') {
  //     const contract = await _intializeContract(signer)
  //     const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
  //     const balance = await contract.balanceOf(account);
  //     console.log("Account Balance: ", balance.toString());
  //   }
  // }

  async function issueToken() {
    if (typeof window.ethereum !== 'undefined') {
      const contract = await _intializeContract(signer)
      await contract.issueToken(codeName, voteAmount);
      console.log("Turings issued!");
    }
  }

  async function vote() {
    if (typeof window.ethereum !== 'undefined') {
      const contract = await _intializeContract(signer)
      await contract.vote(codeName, voteAmount);
      console.log("Vote sent!");
    }
  }

  async function voteOn() {
    if (typeof window.ethereum !== 'undefined') {
      const contract = await _intializeContract(signer)
      await contract.votingOn();
      console.log("Vote is on!");
    }
  }

  async function voteOff() {
    if (typeof window.ethereum !== 'undefined') {
      const contract = await _intializeContract(signer)
      await contract.votingOff();
      console.log("Vote is off!");
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={_getTokenData}>get token data</button>
        <h1>{tokenData.name}</h1>
        <h1>{tokenData.symbol}</h1>

        <button onClick={issueToken}>IssueToken</button>
        <button onClick={vote}>Vote</button>
        <input onChange={e => setCodeName(e.target.value)} placeholder="Codenome" />
        <input onChange={e => setVoteAmount(e.target.value)} placeholder="Amount" />

        <button onClick={voteOn}>Start Voting</button>
        <button onClick={voteOff}>Stop Voting</button>

      </header>
    </div>
  );
}

export default App;
