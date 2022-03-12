import { Typography, Box, Button, TextField, Grid, Paper } from "@mui/material";
import wallet from "./assets/wallet.svg";
const Account = (props) => {
  return (
    <Box>
      <Box marginTop={"20vh"} marginBottom={"3vh"}>
        <Typography component={"h2"} variant={"h2"}>
          Personal Information
        </Typography>
      </Box>
      <Grid container item spacing={3}>
        <Grid item xs={4}>
          <Paper elevation={8}>
            <Box padding={1.5}>
              <Box textAlign={"right"} paddingTop={"3vh"} paddingRight={"3vw"}>
                <img alt="wallet" src={wallet} height={"200%"} />
              </Box>
              <Typography style={{ color: "white" }}>
                Connected with: &nbsp;
                {props.account.substring(0, 5) +
                  "..." +
                  props.account.substring(38)}
              </Typography>

              <Typography>You are currently connected to the </Typography>

              <Typography paddingBottom={"calc(2.4vh + 2.4vw)"}>
                {props.networkchainId}, {props.networkname} network
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper elevation={8}>
            <Box paddingBottom={"0vh"}>
              <Box padding={1.5}>
                <Typography>
                  Enter the address of which you want to see the
                  <Typography
                    variant="p"
                    component="span"
                    sx={{ color: "#00e676" }}
                  >
                    &nbsp; lottery profits &nbsp;
                  </Typography>
                  of.
                </Typography>
                <Button
                  variant={"outlined"}
                  sx={{
                    fontSize: "calc(0.7vh + 0.7vw)",
                    marginBottom: "1.2vh",
                  }}
                  onClick={props.getPersonalWinnings}
                >
                  Check Winnings related to addresse {props.addrFunds}
                </Button>
                <Box textAlign={"center"}>
                  <TextField
                    onChange={(e) => props.handleChangeAddr(e.target.value)}
                    placeholder="Check winnings of..."
                  ></TextField>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper elevation={8}>
            <Box padding={1.5}>
              <Typography>
                <Typography variant="p" component="span" color={"#00e676"}>
                  Withdraw &nbsp;
                </Typography>
                your funds, directly to your address.
              </Typography>
              <br />
              <Box textAlign={"center"} marginTop={"calc(0.1vh + 0.1vw)"}>
                <Button
                  variant={"outlined"}
                  sx={{
                    fontSize: "calc(0.7vh + 0.7vw)",
                    marginBottom: "1.2vh",
                  }}
                  onClick={props.withdrawPriceContract}
                >
                  Submit withdraw address
                </Button>
              </Box>
              <Box textAlign={"center"} marginTop={"calc(1.3vh + 1.3vw)"}>
                <TextField
                  onChange={(e) => props.handleChangeWithdraw(e.target.value)}
                  placeholder="Receiver of Funds..."
                ></TextField>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
    </Box>
  );
};

export default Account;
