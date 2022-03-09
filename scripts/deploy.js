const hre = require("hardhat");
const {
  storeContractAddress,
  verifyContract,
  printEtherscanLink,
} = require("./helper-functions");

const { ethers, network } = hre;

async function deploy(contractName, args = []) {
  const { chainId } = network.config;

  const CF = await ethers.getContractFactory(contractName);
  const contract = await CF.deploy(
    "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9",
    "0xa36085F69e2889c224210F603D836748e7dC0088",
    "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
    "1000000000000000000"
  );

  await contract.deployed();
  await storeContractAddress(contract, contractName);
  await verifyContract(
    contract,
    "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9",
    "0xa36085F69e2889c224210F603D836748e7dC0088",
    "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
    "1000000000000000000"
  );

  console.log("Deployer:", (await ethers.getSigners())[0].address);
  console.log(`${contractName} deployed to:`, contract.address);

  printEtherscanLink(contract.address, chainId);
}

async function main() {
  await deploy(
    "Lottery"
    /* "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9",
    "0xa36085F69e2889c224210F603D836748e7dC0088",
    "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
    "1000000000000000000" */
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
