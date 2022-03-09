import { Typography, Box, Button, TextField } from "@mui/material";
const Account = (props) => {
  return (
    <Box id="accountCSS">
      <Box id="conta">
        <Box id="personalCSS">Personal Information</Box>
        <Typography>You are currently connected with this address:</Typography>
        <Box style={{ color: "rgb(172, 40, 22)" }}>{props.account}</Box>
        <Typography>You are currently connected to the </Typography>
        <Box style={{ color: "rgb(172, 40, 22)" }}>
          <Typography>
            {props.networkchainId}, {props.networkname} network
          </Typography>
        </Box>
        <Typography
          variant="p"
          component="span"
          style={{ color: "rgb(172, 40, 22)" }}
        >
          Withdraw
        </Typography>
        <Typography>
          your funds, directly to your address or choose someone elses to send
          the funds. The entered address will receive YOUR lottery winnings!
        </Typography>
        <Button onClick={props.withdrawPriceContract}>
          Submit withdraw address
        </Button>
        <TextField
          variant="filled"
          onChange={(e) => props.handleChangeWithdraw(e.target.value)}
          placeholder="Enter new address to receive the funds"
        ></TextField>
        Enter the address of which you want to see the{" "}
        <Typography
          variant="p"
          component="span"
          style={{ color: "rgb(172, 40, 22)" }}
        >
          lottery profits
        </Typography>{" "}
        of.
        <Button onClick={props.getPersonalWinnings}>
          Check Winnings related to addresse {props.addrFunds}
        </Button>
        <TextField
          onChange={(e) => props.handleChangeAddr(e.target.value)}
          placeholder="Enter new address to check winnings"
        ></TextField>
      </Box>
    </Box>
  );
};

export default Account;
