import { Typography, Box, Button } from "@mui/material";
const Account = (props) => {
  return (
    <Box id="accountCSS">
      <Box id="conta">
        <Box id="personalCSS">Personal Information</Box>
        <br></br>
        You are currently connected with this address:
        <Box style={{ color: "rgb(172, 40, 22)" }}>{props.account}</Box>
        <br></br>
        You are currently connected to the{" "}
        <Box style={{ color: "rgb(172, 40, 22)" }}>
          {props.networkchainId}, {props.networkname} network
        </Box>
        <br></br>
        <span style={{ color: "rgb(172, 40, 22)" }}>Withdraw</span> your funds,
        directly to your address or choose someone elses to send the funds. The
        entered address will receive YOUR lottery winnings!
        <br></br>
        <Button onClick={props.withdrawPriceContract}>
          Submit withdraw address
        </Button>
        <input
          onChange={(e) => props.handleChangeWithdraw(e.target.value)}
          placeholder="Enter new address to receive the funds"
        ></input>
        <br></br>
        <br></br>
        Enter the address of which you want to see the{" "}
        <span style={{ color: "rgb(172, 40, 22)" }}>lottery profits</span> of.
        <br></br>
        <Button onClick={props.getPersonalWinnings}>
          Check Winnings related to addresse {props.addrFunds}
        </Button>
        <input
          onChange={(e) => props.handleChangeAddr(e.target.value)}
          placeholder="Enter new address to check winnings"
        ></input>
      </Box>
    </Box>
  );
};

export default Account;
