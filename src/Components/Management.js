import * as React from "react";
import { Typography, Box, Button, TextField, Modal } from "@mui/material";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const Management = (props) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Box>
      <div style={{ marginTop: "11vh" }}>
        <Button onClick={handleOpen} variant={"contained"}>
          Open Management
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} color={"white"} textAlign={"center"}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Management of Lottery
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <Box>
                <Box>
                  <Typography>Management only Owner</Typography>
                </Box>
                <Typography variant="span" component="span">
                  Contract deployed &nbsp;
                </Typography>
                at this address: &nbsp;
                <Typography
                  variant="span"
                  component="p"
                  fontSize={"calc(0.5vh + 0.5vw)"}
                >
                  {props.lotteryAddress}
                </Typography>
                <Button
                  variant={"outlined"}
                  sx={{
                    fontSize: "calc(0.7vh + 0.7vw)",
                    marginBottom: "1.2vh",
                  }}
                  className="timeIntervalCSS"
                  onClick={props.changingTimeInterval}
                >
                  Submit new Time interval
                </Button>
                <TextField
                  variant={"filled"}
                  className="timeIntervalCSS"
                  onChange={(e) => props.handleChange(e)}
                  placeholder="Enter new time Interval"
                ></TextField>
                <Box>
                  <Typography marginTop={"1.2vh"}>
                    The contract owner is:{" "}
                    {props.owner.substring(0, 5) +
                      "..." +
                      props.owner.substring(38)}
                  </Typography>
                </Box>
                <Box>
                  <Typography>
                    Winner Address:{" "}
                    {props.winner.substring(0, 5) +
                      "..." +
                      props.winner.substring(38)}
                  </Typography>
                </Box>
                <Button
                  variant={"outlined"}
                  sx={{
                    fontSize: "calc(0.7vh + 0.7vw)",
                    marginBottom: "1.2vh",
                  }}
                  onClick={props.chooseWinnerContract}
                >
                  Choose the Winner
                </Button>
                <Box>
                  <Typography>Start a new Lottery</Typography>
                </Box>
                <Button
                  variant={"outlined"}
                  sx={{
                    fontSize: "calc(0.7vh + 0.7vw)",
                    marginBottom: "1.2vh",
                  }}
                  onClick={props.startNewLotteryContract}
                >
                  Start new Lottery
                </Button>
                <Typography>
                  The new Entry price must be in Ether (E.g. 0.123)
                </Typography>
                <Button
                  variant={"outlined"}
                  sx={{
                    fontSize: "calc(0.7vh + 0.7vw)",
                    marginBottom: "1.2vh",
                  }}
                  className="timeIntervalCSS"
                  onClick={props.changeEntryPrice}
                >
                  Submit new Entry price
                </Button>
                <TextField
                  variant={"filled"}
                  className="timeIntervalCSS"
                  onChange={(e) => props.handleChangePrice(e)}
                  placeholder="0.123"
                ></TextField>
                <Button
                  variant={"outlined"}
                  sx={{
                    fontSize: "calc(0.7vh + 0.7vw)",
                    marginBottom: "1.2vh",
                    marginTop: "1.2vh",
                  }}
                  className="withdrawCSS"
                  onClick={props.getContractBalance}
                >
                  Get Contract Balance in Ether
                </Button>
                <Typography component="span" variant="span">
                  &nbsp;
                  {props.balance
                    ? props.balance
                    : "There is no balance inside the contract"}
                </Typography>
                <Button
                  variant={"outlined"}
                  sx={{
                    fontSize: "calc(0.7vh + 0.7vw)",
                    marginBottom: "1.2vh",
                  }}
                  className="withdrawCSS"
                  onClick={props.withdrawContractProfits}
                >
                  Withdraw Contract Profits
                </Button>
              </Box>
            </Typography>
          </Box>
        </Modal>
      </div>
    </Box>
  );
};

export default Management;
