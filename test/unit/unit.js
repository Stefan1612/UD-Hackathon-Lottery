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

  it("should show TotalCurrentPool", async () => {
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
  });
});

describe("Lottery unit advanced", () => {
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
    // waiting for the time interval to end (10 seconds). Nobody should be allowed to enter afterwards (unless only 1 participant inside the lottery)
    await ethers.provider.send("evm_increaseTime", [11]);
    await expect(
      lt.enterPool({
        value: utils.parseUnits("0.002", "ether"),
      })
    ).to.be.revertedWith("You cannot enter this pool anymore");
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
    // entering the pool within the inital time interval once
    await lt.enterPool({
      value: utils.parseUnits("0.002", "ether"),
    });

    // waiting for the time interval to run out
    await ethers.provider.send("evm_increaseTime", [3600]);
    // due to only 1 participant inside the lottery, the lottery will wait for a second participate
    await lt.enterPool({
      value: utils.parseUnits("0.002", "ether"),
    });
  });

  it("should not change the lottery entry price from 0.002 to 0.003 because a lottery is running", async () => {
    await expect(
      lt.entryPriceInWei(utils.parseUnits("0.002", "ether"))
    ).to.be.revertedWith(
      "You can only change the entry price after the winner has been chosen!"
    );
    expect(utils.formatEther(await lt.price())).to.equal("0.002");
  });
  it("should not change the lottery time interval from 10 to 20 seconds because a lottery is running", async () => {
    await expect(lt.settingTimeInSeconds(20)).to.be.revertedWith(
      "You can only change the time after the winner has been chosen!"
    );
    expect(await lt.time()).to.equal("10");
  });
  it("should not choose a winner after entering the lottery 1 times and waiting till time runs out", async () => {
    // getting 3 different addresses
    const [owner, addr1, addr2] = await ethers.getSigners();
    // entering the pool 3 times with individual addresses
    await lt.enterPool({
      value: utils.parseUnits("0.002", "ether"),
    });
    await expect(await lt.chooseWinner()).to.be.revertedWith(
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
  });
});
