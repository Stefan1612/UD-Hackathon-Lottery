const { expect } = require("chai");
const { ethers } = require("hardhat");
const { utils } = require("ethers");
describe("Lottery basics", () => {
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

  /* it("should show TotalCurrentPool", async () => {
    // currentPool of ether inside the contract should be 0
    expect(await lt.totalCurrentPool()).to.equal("0");
  });
  it("should show current Time interval", async () => {
    // the initial time interval the lottery is running for should equal 10 seconds
    expect(await lt.time()).to.equal("10");
  });
  it("should show startTime + current Time Interval = endTime", async () => {
    // the lottery interval (10) + the start time of the lottery should equal the end time of the lottery
    const startTime = parseInt(await lt.startTime());
    const time = parseInt(await lt.time());
    expect(await lt.endTime()).to.equal(startTime + time);
  });
  it("should return the entry price", async () => {
    // the default price should be 0.002 ether to enter the lottery
    expect(utils.formatEther(await lt.price())).to.equal("0.002");
  });
  it("should return the last winner of the lottery", async () => {
    // the default state for an address should be the 0x0 address
    expect(await lt.winner()).to.equal(
      "0x0000000000000000000000000000000000000000"
    );
  });
  it("should return all current participants", async () => {
    // nobody entered the lottery yet. The participants array should be empty.
    await expect(lt.participants(0)).to.be.reverted;
  });
  it("should return the result", async () => {
    // we didn't choose a winner yet. Default uint should equal 0.
    expect(await lt.randomResult()).to.equal("0");
  });
  it("should return the contract balance", async () => {
    // nobody entered the lobby yet. contract balance should equal 0
    expect(await lt.getBalance()).to.equal("0");
  }); 
  it("should return the array length of 0", async () => {
    expect(await lt.getArrayLength()).to.equal("0");
  });*/
});

describe("Lottery basics", () => {
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
  it("should enter the pool three times", async () => {
    // entering the pool within the inital time interval three times
    await lt.enterPool({
      value: utils.parseUnits("0.002", "ether"),
    });
    await lt.enterPool({
      value: utils.parseUnits("0.002", "ether"),
    });
    await lt.enterPool({
      value: utils.parseUnits("0.002", "ether"),
    });
    expect(await lt.getArrayLength()).to.equal("3");
  });
  it("should not enter the pool due to using incorrect msg.value", async () => {
    // sending the wrong msg.value - 1. underpay - 2. overpay
    // 1.
    await expect(
      lt.enterPool({
        value: utils.parseUnits("0.001", "ether"),
      })
    ).to.be.revertedWith("You need to pay the exact price");
    // 2.
    await expect(
      lt.enterPool({
        value: utils.parseUnits("0.003", "ether"),
      })
    ).to.be.revertedWith("You need to pay the exact price");
  });
  it("should enter the pool 1 time and enter the pool a second time after the time interval (10 seconds) and still work", async () => {
    // entering the pool within the inital time interval three times
    await lt.enterPool({
      value: utils.parseUnits("0.002", "ether"),
    });

    console.log(1);
    async function newStyleDelay() {
      await setTimeout(async function () {
        await lt.enterPool({
          value: utils.parseUnits("0.002", "ether"),
        }), 12000);
      console.log("It will be printed 3-rd with delay");
    }

    newStyleDelay();

    /*   setTimeout(async function () {
      await lt.enterPool({
        value: utils.parseUnits("0.002", "ether"),
      });
    }, 12000); */

    console.log(12);
  });
  /*  it("should change the lottery entry price from 0.002 to 0.003", async () => {
    await lt.entryPriceInWei(0.003);
    expect(utils.formatEther(await lt.price())).to.equal("0.003");
   it("should change the lottery time interval from 10 to 20 seconds", async () => {
    await lt.settingTimeInSeconds(20);
    expect(await lt.time()).to.equal("20");
  });  */
});
