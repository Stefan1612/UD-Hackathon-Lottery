const { expect, should } = require("chai");
const { ethers } = require("hardhat");
const { utils } = require("ethers");

const LinkTokenABI =
  '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]';
describe("Choose Winner Integration, VRF", () => {
  let lt;
  beforeEach(async () => {
    // deploying the lottery contract
    const LT = await ethers.getContractFactory("Lottery");
    lt = await LT.deploy(
      "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9",
      "0xa36085F69e2889c224210F603D836748e7dC0088",
      "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
      "1000000000000000000"
    );
    await lt.deployed();
  });
  it("should choose a winner after entering the lottery 3 times (all different addresses)", async () => {
    // getting signer for account address
    const accounts = await ethers.getSigners();
    const signer = accounts[0];
    // creating a new instance of the linkTokenContract to use his functions
    const linkTokenContract = new ethers.Contract(
      "0xa36085F69e2889c224210F603D836748e7dC0088",
      LinkTokenABI,
      signer
    );
    // transfering 2 link from tester account address to the newly deployed lottery testing contract
    var transferTransaction = await linkTokenContract.transfer(
      lt.address,
      "2000000000000000000"
    );
    // waiting for the transaction to fulfill
    await transferTransaction.wait();
    console.log("hash:" + transferTransaction.hash);
    // entering the pool 2 times with owner address (doesn't matter which address we use)
    await lt.enterPool({
      value: utils.parseUnits("0.002", "ether"),
    });
    await lt.enterPool({
      value: utils.parseUnits("0.002", "ether"),
    });
    // waiting for the lottery time interval to end (10 seconds), so we can keep testing the newly available functions
    await new Promise((resolve) => setTimeout(resolve, 11000));
    // choosing the owner of the lottery -> calling getRandomNumber VRF
    await expect(lt.chooseWinner());
    // it takes some time until the results of the VRF are in. We'll wait 60 seconds for the result to come in
    await new Promise((resolve) => setTimeout(resolve, 60000));
    // we are checking if the result is between the possible indexes (0-1 in this case)
    expect(utils.formatUnits(await lt.randomResult(), 0)).to.satisfy(function (
      num
    ) {
      if (num === "0" || num === "1") {
        return true;
      } else {
        return false;
      }
    });
    /*  .to.be.greaterThan(-1)
      .and.smallerThan("2"); */

    // changing entry price
    await lt.entryPriceInWei(utils.parseUnits("0.003", "ether"));
    // checking if entry price changed successfully
    expect(utils.formatEther(await lt.price())).to.equal("0.003");
    // changing the interval which the lottery is atleast running for
    await lt.settingTimeInSeconds(20);
    // checking if the interval changed to 20 seconds
    expect(await lt.time()).to.equal("20");
    // we shouldn't be able to call the chooseWinner function again without starting a new lottery
    await expect(lt.chooseWinner()).to.be.revertedWith(
      "You need to choose the winner for the current Lottery, before you can start a new one"
    );
    // starting a new lottery
    await lt.startNewLottery();
    // entering the pool once
    await lt.enterPool({
      value: utils.parseUnits("0.002", "ether"),
    });
  });
});
