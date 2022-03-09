import { Typography, Box, Button } from "@mui/material";
const Management = (props) => {
  return (
    <Box id="managementCSS">
      <Box id="contai">
        <Box id="ManagementCSS">Management only Owner</Box>
        <br></br>
        Contract <span style={{ color: "rgb(172, 40, 22)" }}>deployed</span> at
        this address:{" "}
        <span style={{ color: "rgb(172, 40, 22)" }}>
          {props.lotteryAddress}
        </span>
        <br></br>
        <br></br>
        <Button
          className="timeIntervalCSS"
          onClick={props.changingTimeInterval}
        >
          Submit new Time interval
        </Button>
        <input
          className="timeIntervalCSS"
          onChange={(e) => props.handleChange(e)}
          placeholder="Enter new time Interval"
        ></input>
        <br></br>
        <Box>The contract owner is: {props.owner}</Box>
        <br></br>
        <Box>Winner Address: {props.winner}</Box>
        <Button id="choosingWinnerCSS" onClick={props.chooseWinnerContract}>
          Choose the Winner
        </Button>
        <br></br>
        <br></br>
        <Box>Start a new Lottery</Box>
        <Button id="newLotteryCSS" onClick={props.startNewLotteryContract}>
          Start new Lottery
        </Button>
        <br></br>
        <br></br>
        The new Entry price must be in Ether (E.g. 0.123)
        <br></br>
        <Button className="timeIntervalCSS" onClick={props.changeEntryPrice}>
          Submit new Entry price
        </Button>
        <input
          className="timeIntervalCSS"
          onChange={(e) => props.handleChangePrice(e)}
          placeholder="0.123"
        ></input>
        <br></br>
        <br></br>
        <Button className="withdrawCSS" onClick={props.getContractBalance}>
          Get Contract Balance in Ether:
        </Button>
        <span> &nbsp;: {props.balance}</span>
        <br></br>
        <br></br>
        <Button className="withdrawCSS" onClick={props.withdrawContractProfits}>
          Withdraw Contract Profits...
        </Button>
        <br></br>
      </Box>
    </Box>
  );
};

export default Management;
