import { ethers } from "ethers";
import { Typography, Box, Button } from "@mui/material";
const Home = (props) => {
  return (
    <Box id="HomeId">
      {/* <img id="image" src="https://c.pxhere.com/photos/c3/a0/casino_roulette_table_the_dealer_game_fun_addiction_pleasure-993952.jpg!d"></img> */}
      <Box>
        <Typography marginTop={22} component="h1" variant="h1">
          Ethereum Lottery
        </Typography>
        <Typography marginTop={2} component="h2" variant="h2">
          Running on Kovan!
        </Typography>
      </Box>
      <Box>
        <Box>
          <Typography marginTop={"65vh"} sx={{ color: "black" }}>
            {props.isLotteryRunning}
          </Typography>

          <Box>Last Lottery started at: {props.startTime}</Box>
        </Box>

        <Box>
          Current Price Pool in Ether
          <Typography component="span" variant="p" style={{ fontSize: "150%" }}>
            {props.currentPool}
          </Typography>
          {ethers.constants.EtherSymbol}
          <Box>
            Entry cost: {props.price} ether
            {ethers.constants.EtherSymbol}
            <Button onClick={props.enterPoolContract}>
              Buy Lottery Ticket
            </Button>
          </Box>
        </Box>

        <Box>
          Minimun amount of time the Lottery is going to run: {props.time}{" "}
          seconds
        </Box>

        <Box>
          Congratulations to
          {props.winner} !
        </Box>

        <Box>
          Current Participants: <Box>{props.playerArray}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
