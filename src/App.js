import { ethers } from 'ethers'
import { useEffect, useState } from 'react';
import TokenArtifact from "./artifacts/contracts/Turing.sol/Turing.json"

const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const localBlockchainAddress = 'http://localhost:8545'

function App() {

  const [tokenData, setTokenData] = useState({})
  const [voteAmount, setVoteAmount] = useState("1")
  const [codeName, setCodeName] = useState()
  const [isVotingOn, setIsVotingOn] = useState(true)
  const [balances, setBalances] = useState([])
  const [secondsToReload, setSecondsToReload] = useState(0)
  const MAX_SECS_RELOAD = 3;
  const SCALE_SATURINGS = 18; // 10^18

  const handleErroMessage = (error) => {
    console.log(error)
    try {
      let errorMessage;
      errorMessage = error.message.split("\\\"message\\\":\\\"Error:")[1]
      errorMessage = errorMessage.split("\\\",\\\"data\\\":")[0]
      errorMessage = errorMessage.split("reason string ")[1]
      alert(errorMessage)
    } catch (err) {
      alert("Unknown error")
    }
  }

  const getClipPath = (percent) => {
    const angle = (percent / 100) * 360;
    return `conic-gradient(from 0deg at 50% 50%, #ec4899 ${angle}deg, transparent ${angle}deg)`;
  };

  const provider = new ethers.providers.JsonRpcProvider(localBlockchainAddress)
  const signer = provider.getSigner();

  async function intializeContract(init) {
    const contract = new ethers.Contract(
      tokenAddress,
      TokenArtifact.abi,
      init
    );

    return contract
  }

  async function getTokenData() {
    const contract = await intializeContract(signer)
    const name = await contract.name();
    const symbol = await contract.symbol();
    const tokenData = { name, symbol }
    setTokenData(tokenData);

    const voteStatus = await contract.votingStatus();
    setIsVotingOn(voteStatus)
  }

  async function getBalances() {
    if (typeof window.ethereum !== 'undefined') {
      const contract = await intializeContract(signer)
      try {
        const response = await contract.getBalances();
        let aux = response[0].map((a, i) =>
          [
            a,
            ethers.utils.formatUnits(ethers.BigNumber.from(response[1][i]), SCALE_SATURINGS).toString()
          ])
        setBalances(aux);
      } catch (error) {
        handleErroMessage(error);
      }
    }
  }

  async function issueToken() {
    const form = document.getElementById('form-votes');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      const contract = await intializeContract(signer)
      try {
        let parsedAmount = ethers.utils.parseUnits(voteAmount.toString(), SCALE_SATURINGS).toString()
        console.log('Quantity sent to contract: ', parsedAmount);
        await contract.issueToken(codeName, parsedAmount);
        alert("Successful operation!")
      } catch (error) {
        handleErroMessage(error);
      }
    }
  }

  async function vote() {
    if (typeof window.ethereum !== 'undefined') {
      const contract = await intializeContract(signer)
      try {
        let parsedAmount = ethers.utils.parseUnits(voteAmount.toString(), SCALE_SATURINGS).toString()
        console.log('Quantity sent to contract: ', parsedAmount);
        await contract.vote(codeName, parsedAmount);
        alert("Vote added");
      } catch (error) {
        handleErroMessage(error);
      }
    }
  }

  async function voteOn() {
    if (typeof window.ethereum !== 'undefined') {
      const contract = await intializeContract(signer)
      try {
        await contract.votingOn();
        setIsVotingOn(true)
        alert("Votes are open");
      } catch (error) {
        handleErroMessage(error);
      }
    }
  }

  async function voteOff() {
    if (typeof window.ethereum !== 'undefined') {
      const contract = await intializeContract(signer)
      try {
        await contract.votingOff();
        setIsVotingOn(false)
        alert("Votes are closed");
      } catch (error) {
        handleErroMessage(error);
      }
    }
  }

  useEffect(() => {
    getTokenData();
    let aux = 0
    setInterval(() => {
      if (aux >= MAX_SECS_RELOAD) {
        getBalances()
        aux = 0
      } else {
        aux += 0.1
      }
      setSecondsToReload(aux)
    }, 100)
  }, [])

  return (
    <div className='bg-slate-900 min-h-screen text-gray-300 p-10'>
      <header>
        <div className='flex items-center gap-32'>
          <div className='flex items-center gap-3'>
            <img
              className='w-5 rounded-full'
              src="https://s2-galileu.glbimg.com/GgrZ49DBt1ML6GlzKyDcFyJEhEY=/0x0:330x335/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_fde5cd494fb04473a83fa5fd57ad4542/internal_photos/bs/2024/b/o/deNkTTTsWk1WAwaFrOog/alan-turing-1912-1954-in-1936-at-princeton-university.jpg" />
            <p className='text-xl font-bold'>{tokenData.symbol}</p>
          </div>
          <div>
            <span className='mr-5'>Voting status:</span>
            {
              isVotingOn
                ?
                <button className='text-green-500 font-bold text-[8pt] underline' onClick={voteOff}> ✅ ONLINE</button>
                :
                <button className='text-red-500 font-bold text-[8pt] underline' onClick={voteOn}> ❌ OFFLINE</button>
            }
          </div>
        </div>
      </header>

      <main className='mt-10 flex w-full gap-3'>
        {/* CONTROLS */}
        <div className='flex flex-col gap-3'>
          <div className='rounded-lg bg-gray-800 px-3 py-2 w-[200px] h-fit'>
            <p>Votação</p>

            <form id='form-votes' className='flex flex-col gap-3 mt-5'>
              <div className='text-sm'>
                <label className='text-gray-600'>Codename</label>
                <input onChange={e => setCodeName(e.target.value)} placeholder="eg.: nome1" className='w-full bg-gray-900 rounded-md py-1 px-2' required />
              </div>

              <div className='text-sm'>
                <label className='text-gray-600'>Amount (in TUR)</label>
                <input onChange={e => setVoteAmount(parseFloat(e.target.value))} placeholder="eg.: 1" className='w-full bg-gray-900 rounded-md py-1 px-2' required />
              </div>

              <button className='bg-pink-500 text-gray-900 font-bold py-1 rounded-md' onClick={vote} type='button'>
                Vote
              </button>
              <button className='text-pink-500 text-[8pt] underline -mt-2' onClick={issueToken} type='button'>
                Issue Tokens
              </button>
            </form>
          </div>
        </div>

        {/* RANKING */}
        <div className='rounded-lg bg-gray-800 px-3 py-2 w-[300px]'>
          <div className='flex items-center justify-between gap-10'>
            <p>Rankings</p>
            {/* <button className='px-2 py-1 rounded-lg font-bold hover:opacity-65 bg-gray-500 w-fit text-[8pt]' onClick={getBalances}>R</button> */}
            <div className='w-5 h-5 rounded-full bg-pink-500' style={{ background: getClipPath(secondsToReload / MAX_SECS_RELOAD * 100) }}></div>
          </div>

          <table className='w-full mt-5 text-[8pt]'>
            <tbody>
              {balances.map((balance, index) => (
                <tr key={index}>
                  <td className='text-gray-400 pr-1'>{String(index + 1).padStart(2, '0')}</td>
                  <td className='font-bold pr-4'>{balance[0]}</td>
                  <td className='font-bold text-pink-500 text-right pr-2'><span className='truncate w-5'>{balance[1]}</span></td>
                  <td className='font-bold text-pink-500'>TUR</td>
                  <td className='font-bold text-green-500 text-right'>+2.2%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <footer className='mt-20 text-[8pt]'>
        Matheus Meier Schreiber — 2025 — Tópicos em Linguagens de Programação
      </footer>
    </div>
  );
}

export default App;