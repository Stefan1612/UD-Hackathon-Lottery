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
    // listens for a new lottery to start
    eventContract.on("newLotteryStarted", (Unixtime) => {
      console.log("newLotteryStarted at " + Unixtime);
      setLotteryBool(true);
      /* startLotteryCountdown(time); */
      setEventTime(Unixtime);
      setCurrentPool(0);
      setWinner("0x0000000000000000000000000000000000000000");
      setPlayerArray([]);
    });
    // listens for the random result being successfully generated and the winner of the lottery to be selected
    eventContract.on(
      "winnerHasBeenChosen",
      (winnerAddressEvent, totalCurrentPoolEvent, timeEvent) => {
        console.log("lottery ended and the winner is " + winnerAddressEvent);
        getWinnerAddress();
        setLotteryBool(false);
      }
    );
    // event to listen for new participants entering the lottery
    eventContract.on("newParticipant", (newEntry, time) => {
      console.log("new entry, new participant= " + newEntry);
      setEventCurrentPool();
      getContractParticipantsArray();
    });
    // listens for time interval change
    eventContract.on("timeChange", (time) => {
      console.log("time changed to: " + time);
      setTime(time.toNumber());
    });
    // listens for a price change
    eventContract.on("priceChange", (price) => {
      console.log("price changed to: " + price);
      setPrice(bigNumIntoEther4Decimals(price));
    });

    return () => {
      eventContract.on("newLotteryStarted", (Unixtime) => {
        console.log("newLotteryStarted at " + Unixtime);
        setLotteryBool(true);
        /* startLotteryCountdown(time); */
        setEventTime(Unixtime);
        setCurrentPool(0);
        setWinner("0x0000000000000000000000000000000000000000");
        setPlayerArray([]);
      });
      eventContract.removeListener(
        "winnerHasBeenChosen",
        (winnerAddressEvent, totalCurrentPoolEvent, timeEvent) => {
          console.log("lottery ended and the winner is " + winnerAddressEvent);
          getWinnerAddress();
          setLotteryBool(false);
        }
      );
      eventContract.removeListener("newParticipant", (newEntry, time) => {
        console.log("new entry, new participant= " + newEntry);
        setEventCurrentPool();
        getContractParticipantsArray();
      });
      eventContract.removeListener("timeChange", (time) => {
        console.log("time changed to: " + time);
        setTime(time.toNumber());
      });
      eventContract.removeListener("priceChange", (price) => {
        console.log("price changed to: " + price);
        setPrice(bigNumIntoEther4Decimals(price));
      });
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function setEventTime(Unixtime) {
    console.log(Unixtime + time);
    setEndTime(Unixtime + time);
  }
  function setEventCurrentPool() {
    console.log(price);
    setCurrentPool((poolbefore) => poolbefore + price);
  }

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
    // let remainder = data.mod(1e14);
    //console.log(utils.formatEther(data.sub(remainder)));
    let res = utils.formatEther(data);
    res = Math.round(res * 1e4) / 1e4;
    return res;
  }

  useEffect(() => {
    getAccount();
    getContractParticipantsArray();
    getCurrentPool();
    getTime();
    getOwner();
    getPrice();
    getWinnerAddress();
    getCurrentUnixTime(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getAccount() {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } else {
      // eslint-disable-next-line
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
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // network e.g. 42 Kovan
  const [network, setNetwork] = useState({
    chanId: "",
    name: "",
  });

  // fetching and saving network
  useEffect(() => {
    async function setNetworkData() {
      if (provider) {
        const getNetwork = await provider.getNetwork();
        setNetwork(getNetwork);
      }
    }
    setNetworkData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // fetching and saving the CurrentPool Size
  async function getCurrentPool() {
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      provider
    );
    let data = await contract.totalCurrentPool();
    setCurrentPool(bigNumIntoEther4Decimals(data));
  }
  // fetching and saving the current Time interval the lottery is atleast running for
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

  // changing the time interval the lottery is atleast running for
  async function changingTimeInterval() {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      signer
    );
    await contract.settingTimeInSeconds(previewTime);
  }

  // used for changing time interval input field
  const [previewTime, setPreviewTime] = useState("");
  // function called when changing the input of "changingTimeInterval"
  const handleChange = (e) => {
    setPreviewTime(e.target.value);
  };
  // fetching and saving of the contract owner
  async function getOwner() {
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      provider
    );
    let data = await contract.owner();
    setOwner(data);
  }

  // fetching and saving of the current entry price
  async function getPrice() {
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      provider
    );
    let data = await contract.price();
    setPrice(bigNumIntoEther4Decimals(data));
  }

  // used for changing entry price input field
  const [previewPriceTwo, setPreviewPriceTwo] = useState();

  let previewPrice = 0;

  // function called when changing the input of "changeEntryPrice"
  const handleChangePrice = (e) => {
    previewPrice = e.target.value;
    // you need to use dots instead of commas when using ether instead of wei
    previewPrice = previewPrice.toString();
    previewPrice = ethers.utils.parseEther(previewPrice);
    setPreviewPriceTwo(previewPrice);
  };

  // function changing the entry price inside the onchain
  async function changeEntryPrice() {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      signer
    );
    await contract.entryPriceInWei(previewPriceTwo);
  }

  // fetching and saving of the the last winner of the lottery
  async function getWinnerAddress() {
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      provider
    );
    let data = await contract.winner();
    setWinner(data);
  }

  // used to enter the pool, automatically inputs the correct entry price
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
    /* getContractParticipantsArray();
    getCurrentPool(); */
  }

  // used to choose the winner of the current lottery
  async function chooseWinnerContract() {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      signer
    );
    await contract.chooseWinner();
  }

  // switched on and offed during/after lottery
  const [lotteryBool, setLotteryBool] = useState(true);

  // used to start a new lottery
  async function startNewLotteryContract() {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      signer
    );
    await contract.startNewLottery();
  }

  // used for changing withdraw Address input field
  const [withdrawAddress, setWithdrawAddress] = useState("");
  // function called when changing the input of "withdrawPriceContract"
  const handleChangeWithdraw = (e) => {
    setWithdrawAddress(e);
  };

  // used to withdraw price money
  async function withdrawPriceContract() {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      signer
    );
    await contract.withdrawPrice(withdrawAddress);
  }

  // used to get the current Balance (profits of contract itself, all funds of players and past wins that haven't been withdrawn yet) sitting inside the contract
  async function getContractBalance() {
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      provider
    );
    let data = await contract.getBalance();
    setBalance(bigNumIntoEther4Decimals(data));
  }
  // fetching and saving the current lottery profits sitting inside the contract (profits of the lottery itself, withdrawable by owner/government)
  async function getContractProfits() {
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      provider
    );
    let data = await contract.lotteryProfits();
    setLotteryProfits(bigNumIntoEther4Decimals(data));
  }
  // used by the owner/governments protocol to withdraw the fee profit of the contract
  async function withdrawContractProfits() {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      signer
    );
    await contract.lotteryProfitsWithdraw();
  }
  // used for changing submit Withdraw address input field
  const [submitWithdrawAddress, setSubmitWithdrawAddress] = useState();
  // function called when changing the input of "withdrawContractProfits"
  const handleChangeAddr = (e) => {
    setSubmitWithdrawAddress(e);
  };

  // fetching and saving of personal funds available inside the contract
  async function getPersonalWinnings() {
    const contract = new ethers.Contract(
      lotteryAddress[42].Lottery,
      lotteryABI.abi,
      provider
    );
    let data = await contract.winners(submitWithdrawAddress);
    setAddrFunds(bigNumIntoEther4Decimals(data));
  }

  // endTime = unix when the minimum amount time the lottery HAS to run passes. It still keep on being active (if there is only 1 participant)
  const [endTime, setEndTime] = useState();
  // unix time when lottery started
  const [startTime, setStartTime] = useState();

  // currentUnix time
  const [currentUnix, setCurrentUnix] = useState(
    Math.round(new Date().getTime() / 1000)
  );

  // checking if lottery time interval has run out
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

  // timer that ticks every seconds
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
      <Header FirstLoad={getAccount} />
      <BackgroundImage />
      <Box
        id="background"
        marginTop={"58vh"}
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
            <Box id="entry">
              <Routes>
                <Route
                  exact
                  path="/"
                  element={
                    <Home
                      isLotteryRunning={isLotteryRunning}
                      startTime={startTime}
                      getCurrentPool={getCurrentPool}
                      currentPool={currentPool}
                      getTime={getTime}
                      time={time}
                      getPrice={getPrice}
                      price={price}
                      getWinnerAddress={getWinnerAddress}
                      winner={winner}
                      enterPoolContract={enterPoolContract}
                      getContractParticipantsArray={
                        getContractParticipantsArray
                      }
                      playerArray={playerArray}
                    />
                  }
                />
              </Routes>
            </Box>
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
