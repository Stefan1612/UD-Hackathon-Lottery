import { Typography, Box, Button, TextField } from "@mui/material";
const Management = (props) => {
  return (
    <Box id="managementCSS">
      <Box id="contai">
        <Box id="ManagementCSS">
          <Typography>Management only Owner</Typography>
        </Box>
        <Typography>Contract</Typography>
        <Typography
          variant="p"
          component="span"
          style={{ color: "rgb(172, 40, 22)" }}
        >
          deployed
        </Typography>{" "}
        at this address:{" "}
        <Typography
          variant="h2"
          component="span"
          style={{ color: "rgb(172, 40, 22)" }}
        >
          {props.lotteryAddress}
        </Typography>
        <Button
          className="timeIntervalCSS"
          onClick={props.changingTimeInterval}
        >
          Submit new Time interval
        </Button>
        <TextField>
          className="timeIntervalCSS" onChange={(e) => props.handleChange(e)}
          placeholder="Enter new time Interval"
        </TextField>
        <Box>
          <Typography>The contract owner is: {props.owner}</Typography>
        </Box>
        <Box>
          <Typography>Winner Address: {props.winner}</Typography>
        </Box>
        <Button id="choosingWinnerCSS" onClick={props.chooseWinnerContract}>
          Choose the Winner
        </Button>
        <Box>
          <Typography>Start a new Lottery</Typography>
        </Box>
        <Button id="newLotteryCSS" onClick={props.startNewLotteryContract}>
          Start new Lottery
        </Button>
        <Typography>
          The new Entry price must be in Ether (E.g. 0.123)
        </Typography>
        <Button className="timeIntervalCSS" onClick={props.changeEntryPrice}>
          Submit new Entry price
        </Button>
        <TextField
          className="timeIntervalCSS"
          onChange={(e) => props.handleChangePrice(e)}
          placeholder="0.123"
        ></TextField>
        <Button className="withdrawCSS" onClick={props.getContractBalance}>
          Get Contract Balance in Ether:
        </Button>
        <Typography component="span" variant="p">
          &nbsp;: {props.balance}
        </Typography>
        <Button className="withdrawCSS" onClick={props.withdrawContractProfits}>
          Withdraw Contract Profits...
        </Button>
      </Box>
    </Box>
  );
};

export default Management;
