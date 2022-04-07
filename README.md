# VRF-Lottery Status/Issues/Ideas

## Status

- Work in progress

## Demo Video

### To-do's

- Rewrite the frontend to utilize events
- Governments protocol

## Approach

This is a lottery running on kovan using chainlink's VRF to generate proven random results.

## Stack

### Blockchain Technologies

1. Environment - [Hardhat](https://hardhat.org/)
2. Oracle - [Chainlink VRF](https://docs.chain.link/docs/chainlink-vrf/)
3. Client - [ethers.js](https://docs.ethers.io/v5/)

### Frontend

- [React](https://reactjs.org/)
- [ethers.js](https://docs.ethers.io/v5/)
- [MUI: React UI Library](https://mui.com/)

## Backend

- [Netlify](https://www.netlify.com/): Website host
- [Node.js](https://nodejs.org/en/)

## Fundamental Issues

Currently the Lottery is controlled by a single enitity, the owner. He is the only one that can start and choose a winner of the lottery.
He is also the only one that can change the entry Price and the time period the lottery is minimun running for.

## Solutions

One way to fix this kind of centralized contract, is to introduce a governments protocol which would control all functions mentioned above.
This way a community could control the lottery.

## Technical Issues

1. Normally you shouldn't use block.timestamp for future time based events. Using the block.timestamp method means that your contract may be vurnerable to miners having more control over the outcome than regular users. In this case as long as you keep the minimun time the lottery is running, higher then 15 seconds (15 second rule). Currently it's in the owners hand to decide that.

## Solutions

1. Using a future time event based on future block NUMBER is a better version to deal with these kind of contracts.

## Challenges Overcome

1. Integration VRF tests
2. VRF random Number
