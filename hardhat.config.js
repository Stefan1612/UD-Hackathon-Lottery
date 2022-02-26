require("@nomiclabs/hardhat-waffle");
require("dotenv").config()
const kovanURL = process.env.APP_KOVAN_ENDPOINT
const privateKey = process.env.APP_PRIVATE_KEY

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    kovan: {
      url: kovanURL,
      accounts: [privateKey]
    }
  },
  paths:{
    artifacts: "./src/artifacts",
  },
  solidity:{
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
};
