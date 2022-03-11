import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
export default function SimpleAccordion() {
  return (
    <div style={{ marginTop: "5vh", marginBottom: "6vh" }}>
      <Box marginBottom={"2vh"}>
        <Typography variant={"h3"} component={"h3"}>
          FAQ section
        </Typography>
      </Box>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4a-content"
          id="panel4a-header"
        >
          <Typography>Are the results actually random?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Yes 100%, the winner of the Lottery gets chosen with a random Number
            which gets generated off-chain via Chainlink's VRF. Additionally
            this random number gets tested and proven as truly random ON-CHAIN.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>On which Network is this Lottery running?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>The Lottery is currently running on kovan.</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Can the same address enter multiple Times?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Yes, you can enter multiple times with the same address and it will
            increase your chances of winning accordingly.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>
            Who is controlling the starting process of a new Lottery?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Currently, the initial deployer of the contract starts a new
            Lottery. This process will be automated via a governments protocol
            utilizing a DAO in the future.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
