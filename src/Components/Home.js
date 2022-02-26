import {ethers} from "ethers";
//https://www.shutterstock.com/de/image-illustration/casino-poker-chips-falling-on-green-657846469
//https://image.shutterstock.com/z/stock-photo-casino-poker-chips-falling-on-green-felt-background-d-illustration-657846469.jpg

const Home = (props) => {
    return (
        <div id="HomeId">
            <img id="image" src="https://c.pxhere.com/photos/c3/a0/casino_roulette_table_the_dealer_game_fun_addiction_pleasure-993952.jpg!d"></img>
            <div id="titles">
                <h1 id="bigTitle">Ethereum Lottery</h1>
                <h2 id="title">This is running on the Kovan Network!</h2>
            </div>
            <div id="homeInfos">
            <div id="isLottery">{props.isLotteryRunning} <div id="lastStartedCSS">Last Lottery started at: {props.startTime}       
            </div>
            </div>          
           <br></br>
           <div id="CurrentPriceCSS">Current Price Pool in Ether <span style={{fontSize: "150%"}}>{props.currentPool}</span> {ethers.constants.EtherSymbol}<div id="entryPriceCSS" ><br></br>Entry cost: {props.price} ether {ethers.constants.EtherSymbol}<button id="buyTicket" onClick={props.enterPoolContract}>Buy Lottery Ticket
           </button>
           </div></div>
          
           <br></br>
           <div id="timeCSS">Minimun amount of time the Lottery is going to run: {props.time} seconds
           </div>
           
           <br></br>
           <div id="winnerCSS">Congratulations to <br></br>{props.winner} !
           </div>
          
           <br></br>
           <div id="playerList">Current Participants: <div>{props.playerArray}</div></div>
           </div>
        </div>
    )
}

export default Home
