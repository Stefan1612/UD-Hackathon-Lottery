// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

//random Number oracle
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

//debugging
import "hardhat/console.sol";

// restricted access
import "@openzeppelin/contracts/access/Ownable.sol";

// prevent reentrancy attacks
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/* When deploying to local network you need to change the algorithm for drawing a random winner, from 
oracle version to non-oracle version(the code is already written you just need to uncomment). Instead of using the local version, you could try to fork the mainnet or kovan via hardhat in your local net.
The oracle version is interacting with chainlink nodes which are not accessible on your local network.
*/

contract Lottery is Ownable, ReentrancyGuard, VRFConsumerBase {
    //

    // @Dev constructor  @arg:
    //kovan:
    //vrf: 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9,
    //link: 0xa36085F69e2889c224210F603D836748e7dC0088,
    //keyHash: 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4,
    //Fee: 1000000000000000000

    // total amount of wei in the current running lottery pool
    uint256 public totalCurrentPool;

    // changing the runtime of the lottery, default 10 seconds for testing purposes
    uint256 public time = 10 seconds;

    //external
    function settingTimeInSeconds(uint256 newTime) external onlyOwner {
        require(
            winnerChosen == true,
            "You can only change the time after the winner has been chosen!"
        );
        time = newTime;
        emit timeChange(time);
    }

    // keeping track of the past winnings of individuals to withdraw

    //private
    mapping(address => uint256) public winners;

    //Initialized as timestamp when the contract got deployed but will also be refreshed everytime
    //a new lottery has started to the current block.timestamp
    uint256 public startTime;

    uint256 public endTime;

    // lottery entry price
    uint256 public price = 0.002 ether;

    //external
    //changing entry price
    function entryPriceInWei(uint256 newPrice) external onlyOwner {
        require(
            winnerChosen == true,
            "You can only change the entry price after the winner has been chosen!"
        );
        price = newPrice;
        emit priceChange(price);
    }

    // winner of the last lottery
    address payable public winner;

    //private
    //to make sure that only ONE lottery gets run at a time
    bool private winnerChosen = false;

    // everyone in the currently running lottery
    address payable[] public participants;

    // @Dev vrf, link for random num offchain
    constructor(
        address vrfCoordinator,
        address link,
        bytes32 _keyHash,
        uint256 _fee
    ) VRFConsumerBase(vrfCoordinator, link) Ownable() ReentrancyGuard() {
        keyHash = _keyHash;
        fee = _fee;
        startTime = block.timestamp;
        endTime = block.timestamp + time;
    }
    // entry price change
    event priceChange(
        uint indexed newPrice
    );
    // lottery time interval change
    event timeChange(
        uint indexed newTime
    );
    // emitting lottery ended, winner, and his price
    event winnerHasBeenChosen(
        address indexed _winner,
        uint256 indexed totalWinning,
        uint256 indexed time
    );

    // @Dev new Lottery started
    event newLotteryStarted(uint256 indexed time);

    // @Dev someone entered the lottery (multiple entry of same address allowed)
    event newParticipant(address indexed newEntry, uint256 indexed time);

    //restricting time to join and a minimun of participants, else you cannot draw a winner
    modifier onlyWhile(uint256 _time) {
        require(
            _time >= block.timestamp || participants.length < 2,
            "You cannot enter this pool anymore"
        );
        _;
    }

    //@Dev making sure the EXACT entry price is transfered
    modifier entryPrice() {
        require(msg.value == price, "You need to pay the exact price");
        _;
    }

    //@Dev Checking if lottery time has ran out
    modifier onlyAfter(uint256 _time) {
        require(_time <= block.timestamp, "The lottery has not ended yet");
        _;
    }

    //do i even need this?
    function getArrayLength() external view returns (uint256 length) {
        length = participants.length;
    }

    //external
    // @dev function to enter the current lottery
    function enterPool()
        external
        payable
        entryPrice
        onlyWhile(startTime + time)
    {
        require(winnerChosen == false, "A new lottery has to be started");

        //multiple entry allowed
        participants.push(payable(msg.sender));
        totalCurrentPool += price;
        emit newParticipant(msg.sender, block.timestamp);
    }

    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;

    function getRandomNumber() private returns (bytes32 requestId) {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK - fill contract with faucet"
        );
        return requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        randomResult = (randomness % participants.length);
        secondPartChoose(randomResult);
    }

    //external
    // @dev choosing the winner of the current lottery
    function chooseWinner() external onlyOwner onlyAfter(startTime + time) {
        require(
            participants.length >= 2,
            "There are not enough participants yet"
        );
        require(winnerChosen == false, "The time has not run out yet");

        //Cut this:
        getRandomNumber();
        //cut end

        //Non oracle solution
        // @Dev Uncomment and cut the getRandomNumber(), line 141 right above this

        //uncomment for non-oracle testing purposes
        /*uint256 range = participants.length;

        uint256 winnerIndex = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, block.difficulty, msg.sender)
            )
        ) % range;

        winner = payable(participants[winnerIndex]);

        // 10% profit cut for contract
        winners[winner] += (totalCurrentPool * 9) / 10;
        lotteryProfits += (totalCurrentPool * 1) / 10;

        // clearing the participant list
        delete participants;

        // emit that winner has been chosen and he can retrieve his winnings
        emit winnerHasBeenChosen(winner, totalCurrentPool, block.timestamp);
        totalCurrentPool = 0;
        winnerChosen = true;*/
    }

    //also cut this for non-oracle:
    //@Dev second part of choosing a random Winner
    function secondPartChoose(uint256 _randomResult) private {
        //oracle solution

        //winner = payable(participants[winnerIndex]);
        winner = payable(participants[_randomResult]);

        // 10% profit cut for contract
        winners[winner] += (totalCurrentPool * 9) / 10;
        lotteryProfits += (totalCurrentPool * 1) / 10;

        // clearing the participant list
        delete participants;

        // emit that winner has been chosen and he can retrieve his winnings
        emit winnerHasBeenChosen(winner, totalCurrentPool, block.timestamp);
        totalCurrentPool = 0;
        winnerChosen = true;
    }

    //cut end

    //external
    //@Dev Starting a new Lottery
    function startNewLottery() external onlyOwner {
        require(
            winnerChosen == true,
            "You need to choose the winner for the current Lottery, before you can start a new one"
        );
        // resetting the timestamp will automatically start a new lottery
        startTime = block.timestamp;
        endTime = block.timestamp + time;
        winnerChosen = false;
        winner = payable(address(0));
        emit newLotteryStarted(block.timestamp);
    }

    //external
    // @dev function to withdraw your price money
    // @param _receiver address of the price money
    function withdrawPrice(address payable _receiver) external nonReentrant {
        require(winners[msg.sender] > 0, "You have not won a lottery yet");
        //winners[msg.sender] =0;
        (bool sent, ) = _receiver.call{value: winners[msg.sender]}("");
        require(sent, "Failed to send Ether");
        winners[msg.sender] = 0;
    }

    //private
    uint256 private lotteryProfits;

    //external
    function getBalance() external view returns (uint256 contractBalance) {
        contractBalance = address(this).balance;
    }

    //external
    function lotteryProfitsWithdraw() external onlyOwner nonReentrant {
        require(lotteryProfits > 0, "No profits to take");
        //lotteryProfits = 0;
        (bool sent, ) = msg.sender.call{value: lotteryProfits}("");
        require(sent, "Failed to send Ether");
        lotteryProfits = 0;
    }
}
