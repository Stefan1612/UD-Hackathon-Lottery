import "./App.css";

import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./Components/Home";
import Account from "./Components/Account";
import Management from "./Components/Management";
import FAQ from "./Components/FAQ";
import { ethers } from "ethers";
import lotteryABI from "./config/contracts/Lottery.json";
import lotteryAddress from "./config/contracts/map.json";
import { Container, Box, ThemeProvider } from "@mui/material";
import BackgroundImage from "./Components/BackgroundImage";
import Header from "./Components/Header";
import theme from "./Components/theme/theme";
const { utils } = require("ethers");

function App() {
  //running on kovan

  const [account, setAccount] = useState("");
  // const [chainID, setChainID] = useState("")

  const [currentPool, setCurrentPool] = useState("");

  const [time, setTime] = useState("");
  const [owner, setOwner] = useState("");
  const [price, setPrice] = useState("");
  const [winner, setWinner] = useState("");
  const [balance, setBalance] = useState("");
  const [addrFunds, setAddrFunds] = useState("");
  const [lotteryProfits, setLotteryProfits] = useState("");
  const [isLotteryRunning, setIsLotteryRunning] = useState("Yes");

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const eventContract = new ethers.Contract(
    lotteryAddress[42].Lottery,
    lotteryABI.abi,
    provider
  );

  useEffect(() => {
    eventContract.on(
      "lotteryEnd",
      (winnerAddressEvent, totalCurrentPoolEvent, timeEvent) =>
        getWinnerAddress()
    );
    return () => {
      eventContract.removeListener(
        "lotteryEnd",
        (winnerAddressEvent, totalCurrentPoolEvent, timeEvent) =>
          getWinnerAddress()
      );
    };
  }, []);

  useEffect(() => {
    eventContract.on("newLotteryStarted", (winnerAddressEvent) =>
      getWinnerAddress()
    );
    return () => {
      eventContract.removeListener("newLotteryStarted", (winnerAddressEvent) =>
        getWinnerAddress()
      );
    };
  }, []);

  const [playerArray, setPlayerArray] = useState([]);
  const [lengthPlayerArray, setLengthPlayerArray] = useState();

  async function getContractParticipantsArray() {
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      provider
    );
    let array = await contract.getArrayLength();
    array = array.toNumber();
    setLengthPlayerArray(array);

    let memoryArray = [];
    if (array === 0) {
      setPlayerArray(["There are no participants yet"]);
    } else {
      for (let i = 0; i < array; i++) {
        let data = await contract.participants(i);
        if (i === 0) {
          memoryArray.push(data);
        } else {
          memoryArray.push(", " + data);
        }
      }
      setPlayerArray(memoryArray);
    }
  }

  function bigNumIntoEther4Decimals(data) {
    // from stackexchange https://ethereum.stackexchange.com/questions/84004/ethers-formatetherwei-with-max-4-decimal-places/97885
    let remainder = data.mod(1e14);
    //console.log(utils.formatEther(data.sub(remainder)));
    let res = utils.formatEther(data);
    res = Math.round(res * 1e4) / 1e4;
    return res;
  }

  useEffect(() => {
    FirstLoad();
    gf();
    getContractParticipantsArray();
    getCurrentPool();
    getTime();
    getOwner();
    getPrice();
    getWinnerAddress();
    getLotteryEndingTime();
    getCurrentUnixTime();
  }, []);

  async function FirstLoad() {
    if (typeof window.ethereum !== undefined) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } else {
      window.alert("Install Metamask!");
    }
  }

  useEffect(() => {
    window.ethereum.on("chainChanged", handleChainChanged);
    return () => {
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  function handleChainChanged(_chainId) {
    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();
  }

  useEffect(() => {
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  // For now, 'eth_accounts' will continue to always return an array
  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log("Please connect to MetaMask.");
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      // Do any other work!
    }
  }

  const [network, setNetwork] = useState({
    chanId: "",
    name: "",
  });

  async function gf() {
    const network = await provider.getNetwork();
    setNetwork(network);
  }

  // this should update automatically everytime the pool increases * not working correctly
  async function getCurrentPool() {
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      provider
    );
    let data = await contract.totalCurrentPool();
    setCurrentPool(bigNumIntoEther4Decimals(data));
  }
  async function getTime() {
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      provider
    );
    let data = await contract.time();
    data = data.toNumber();
    setTime(data);
  }

  async function changingTimeInterval() {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      signer
    );
    await contract.settingTimeInSeconds(previewTime);
  }

  const [previewTime, setPreviewTime] = useState("");

  const handleChange = (e) => {
    setPreviewTime(e.target.value);
  };

  async function getOwner() {
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      provider
    );
    let data = await contract.owner();
    setOwner(data);
  }

  async function getPrice() {
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      provider
    );
    let data = await contract.price();
    setPrice(bigNumIntoEther4Decimals(data));
  }

  const [previewPriceTwo, setPreviewPriceTwo] = useState();

  let previewPrice = 0;

  const handleChangePrice = (e) => {
    previewPrice = e.target.value;
    // you need to use dots instead of commas when using ether instead of wei
    previewPrice = previewPrice.toString();
    previewPrice = ethers.utils.parseEther(previewPrice);
    setPreviewPriceTwo(previewPrice);
  };

  async function changeEntryPrice() {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      signer
    );
    await contract.entryPriceInWei(previewPriceTwo);
    getPrice();
  }

  async function getWinnerAddress() {
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      provider
    );
    let data = await contract.winner();
    setWinner(data);
  }

  async function enterPoolContract() {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      signer
    );
    // if you send a value with the message you gotta put it into the LAST param
    let data = await contract.enterPool({
      value: ethers.utils.parseEther(price.toString()),
    });
    await data.wait();
    getContractParticipantsArray();
    getCurrentPool();
  }

  // everything seems to be working fine with this function BUT the side crashes after using it
  async function chooseWinnerContract() {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      signer
    );
    let data = await contract.chooseWinner();
    await data.wait();
    getWinnerAddress();
    getCurrentPool();
    setLotteryBool(false);
  }

  const [lotteryBool, setLotteryBool] = useState(true);

  async function startNewLotteryContract() {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      signer
    );
    let data = await contract.startNewLottery();
    await data.wait();
    setLotteryBool(true);
    getContractParticipantsArray();
    getPrice();
    getTime();
    getLotteryEndingTime();
    getCurrentPool();
  }

  async function withdrawPriceContract() {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      signer
    );
    await contract.withdrawPrice(withdrawAddress);
  }

  const [withdrawAddress, setWithdrawAddress] = useState("");

  const handleChangeWithdraw = (e) => {
    setWithdrawAddress(e);
  };

  async function getContractBalance() {
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      provider
    );
    let data = await contract.getBalance();
    setBalance(bigNumIntoEther4Decimals(data));
  }

  async function withdrawContractProfits() {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      signer
    );
    await contract.lotteryProfitsWithdraw();
  }

  const [submitWithdarwAddresse, setSubmitWithdrawAddresse] = useState();

  const handleChangeAddr = (e) => {
    setSubmitWithdrawAddresse(e);
  };

  async function getPersonalWinnings() {
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      provider
    );
    let data = await contract.winners(submitWithdarwAddresse);
    setAddrFunds(bigNumIntoEther4Decimals(data));
  }

  async function getContractProfits() {
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      provider
    );
    let data = await contract.lotteryProfits();
    setLotteryProfits(bigNumIntoEther4Decimals(data));
  }

  const [endTime, setEndTime] = useState();
  const [startTime, setStartTime] = useState();

  async function getLotteryEndingTime() {
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      provider
    );
    let data = await contract.endTime();
    data = data.toNumber();

    setEndTime(data);
    data = await contract.startTime();
    data = data.toNumber();

    setStartTime(data);
  }

  const [currentUnix, setCurrentUnix] = useState(
    Math.round(new Date().getTime() / 1000)
  );

  function getCurrentUnixTime() {
    setCurrentUnix(Math.round(new Date().getTime() / 1000));
    if (
      (currentUnix >= endTime && lengthPlayerArray >= 2) ||
      lotteryBool === false
    ) {
      setIsLotteryRunning("Currently no lottery running!");
    } else {
      setIsLotteryRunning("Lottery ongoing!");
    }
  }

  // using the block.timestamp to create a timer, using this method you need to follow the 15 second rule. The timer is not going to be accurate at all for periods under this time period.

  useEffect(() => {
    let myInterval = setInterval(() => {
      getCurrentUnixTime();
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <BackgroundImage />
      <Box
        id="background"
        marginTop={"90vh"}
        sx={{ backgroundColor: "#212121" }}
      >
        <Container>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
            integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />

          <Box sx={{ color: "white" }}>
            <Routes>
              <Route
                exact
                path="/"
                element={
                  <Home
                    isLotteryRunning={isLotteryRunning}
                    startTime={startTime}
                    getLotteryEndingTime={getLotteryEndingTime}
                    getCurrentPool={getCurrentPool}
                    currentPool={currentPool}
                    getTime={getTime}
                    time={time}
                    getPrice={getPrice}
                    price={price}
                    getWinnerAddress={getWinnerAddress}
                    winner={winner}
                    enterPoolContract={enterPoolContract}
                    getContractParticipantsArray={getContractParticipantsArray}
                    playerArray={playerArray}
                  />
                }
              />
            </Routes>

            <Box id="personal account">
              <Account
                account={account}
                networkchainId={network.chainId}
                networkname={network.name}
                withdrawPriceContract={withdrawPriceContract}
                handleChangeWithdraw={handleChangeWithdraw}
                getPersonalWinnings={getPersonalWinnings}
                addrFunds={addrFunds}
                handleChangeAddr={handleChangeAddr}
              />
            </Box>

            <Box id="Management">
              <Management
                lotteryAddress={lotteryAddress[42].Lottery}
                changingTimeInterval={changingTimeInterval}
                handleChange={handleChange}
                getOwner={getOwner}
                owner={owner}
                chooseWinnerContract={chooseWinnerContract}
                startNewLotteryContract={startNewLotteryContract}
                changeEntryPrice={changeEntryPrice}
                handleChangePrice={handleChangePrice}
                getContractBalance={getContractBalance}
                balance={balance}
                withdrawContractProfits={withdrawContractProfits}
                getContractProfits={getContractProfits}
                lotteryProfits={lotteryProfits}
                getWinnerAddress={getWinnerAddress}
                winner={winner}
              />
            </Box>
            <Box id="faq">
              <FAQ></FAQ>
            </Box>
            <footer id="footer">
              <i className="fab fa-github">&nbsp;&nbsp;&nbsp; </i>
              <i className="fab fa-twitter">&nbsp;&nbsp;&nbsp; </i>
              <i className="fab fa-discord">&nbsp;&nbsp;&nbsp;</i>
              <i className="fab fa-linkedin-in">&nbsp;&nbsp;&nbsp;</i>
              <i className="fab fa-youtube">&nbsp;&nbsp;&nbsp;</i>
            </footer>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
