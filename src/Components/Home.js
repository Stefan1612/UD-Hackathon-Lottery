import { ethers } from "ethers";
import { Typography, Box, Button } from "@mui/material";
const Home = (props) => {
  return (
    <Box id="HomeId">
      {/* <img id="image" src="https://c.pxhere.com/photos/c3/a0/casino_roulette_table_the_dealer_game_fun_addiction_pleasure-993952.jpg!d"></img> */}
      <Box id="titles">
        <Typography id="bigTitle">Ethereum Lottery</Typography>
        <Typography id="title">
          This is running on the Kovan Network!
        </Typography>
      </Box>
      <Box id="homeInfos">
        <Box id="isLottery">
          {props.isLotteryRunning}{" "}
          <Box id="lastStartedCSS">
            Last Lottery started at: {props.startTime}
          </Box>
        </Box>
        <br></br>
        <Box id="CurrentPriceCSS">
          Current Price Pool in Ether{" "}
          <span style={{ fontSize: "150%" }}>{props.currentPool}</span>{" "}
          {ethers.constants.EtherSymbol}
          <Box id="entryPriceCSS">
            <br></br>Entry cost: {props.price} ether{" "}
            {ethers.constants.EtherSymbol}
            <button id="buyTicket" onClick={props.enterPoolContract}>
              Buy Lottery Ticket
            </button>
          </Box>
        </Box>

        <br></br>
        <Box id="timeCSS">
          Minimun amount of time the Lottery is going to run: {props.time}{" "}
          seconds
        </Box>

        <br></br>
        <Box id="winnerCSS">
          Congratulations to <br></br>
          {props.winner} !
        </Box>

        <br></br>
        <Box id="playerList">
          Current Participants: <Box>{props.playerArray}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
