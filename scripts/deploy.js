
const hre = require("hardhat");

async function main() {

  const Lottery = await hre.ethers.getContractFactory("Lottery");
  const lottery = await Lottery.deploy(
    "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9",
    "0xa36085F69e2889c224210F603D836748e7dC0088", 
    "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4", 
    "1000000000000000000"
  );
  await lottery.deployed();
  console.log("Lottery deployed to:", lottery.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
