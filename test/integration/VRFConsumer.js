const { expect } = require("chai");
const { ethers } = require("hardhat");
const { utils } = require("ethers");
const LinkTokenABI =
  '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]';
describe("Choose Winner Integration, VRF", () => {
  let lt;
  beforeEach(async () => {
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
    // getting 3 different addresses
    const accounts = await ethers.getSigners();
    const signer = accounts[0];
    const linkTokenContract = new ethers.Contract(
      "0xa36085F69e2889c224210F603D836748e7dC0088",
      LinkTokenABI,
      signer
    );
    var transferTransaction = await linkTokenContract.transfer(
      lt.address,
      "2000000000000000000"
    );
    await transferTransaction.wait();
    console.log("hash:" + transferTransaction.hash);
    await lt.enterPool({
      value: utils.parseUnits("0.002", "ether"),
    });
    await lt.enterPool({
      value: utils.parseUnits("0.002", "ether"),
    });
    await new Promise((resolve) => setTimeout(resolve, 11000));
    let result = await expect(lt.chooseWinner());
    console.log(result);
    await new Promise((resolve) => setTimeout(resolve, 60000));
    result = await lt.randomResult();
    console.log(result);
    /* const [owner, addr1, addr2] = await ethers.getSigners();
    // entering the pool 3 times with individual addresses
    await lt.enterPool({
      value: utils.parseUnits("0.002", "ether"),
    });
    await expect(lt.chooseWinner()).to.be.revertedWith(
      "The lottery has not ended yet"
    );
    await lt.connect(addr1).enterPool({
      value: utils.parseUnits("0.002", "ether"),
    });
    await lt.connect(addr2).enterPool({
      value: utils.parseUnits("0.002", "ether"),
    });
    // checking that the array includes all new entries
    expect(await lt.getArrayLength()).to.equal("3");
    // checking each individual index to check if different addresses are picked up and saved correctly
    expect(await lt.participants(0)).to.equal(owner.address);
    expect(await lt.participants(1)).to.equal(addr1.address);
    expect(await lt.participants(2)).to.equal(addr2.address);

    await expect(lt.chooseWinner()).to.be.revertedWith(
      "The lottery has not ended yet"
    );
    // waiting for the time interval to run out
    await ethers.provider.send("evm_increaseTime", [10]);
    let result = await expect(lt.chooseWinner());
    console.log(result);
    await new Promise((resolve) => setTimeout(resolve, 60000)); */
    /* result = await lt.randomResult();
    console.log(result); */
  });
});
