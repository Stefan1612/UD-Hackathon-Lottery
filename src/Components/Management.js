
const Management = (props) => {
    return (
        <div id="managementCSS">
            <div id="contai">
                <div id="ManagementCSS">Management only Owner</div>
            
            <br></br>
            Contract <text style={{color: "rgb(172, 40, 22)"}}>deployed</text> at this address: <text style={{color: "rgb(172, 40, 22)"}}>{props.lotteryAddress}</text>
            <br></br>
            <br></br>
            <button class="timeIntervalCSS"onClick={props.changingTimeInterval}>Submit new Time interval</button>
           <input class="timeIntervalCSS"onChange={e => props.handleChange(e)} placeholder="Enter new time Interval"></input>
           <br></br>
           <div>The contract owner is: {props.owner}
           </div>
           <br></br>
           <div >Winner Address: {props.winner} 
           </div>
           
           <button id="choosingWinnerCSS"onClick={props.chooseWinnerContract}>Choose the Winner
           </button>
           <br></br>
           <br></br>
           <div>Start a new Lottery</div>        
           <button id="newLotteryCSS"onClick={props.startNewLotteryContract}>Start new Lottery
           </button>  
           <br></br>
           <br></br>
           The new Entry price must be in Ether (E.g. 0.123)
           <br></br>
           <button class="timeIntervalCSS"onClick={props.changeEntryPrice}>Submit new Entry price</button>
           <input class="timeIntervalCSS"onChange={e => props.handleChangePrice(e)} placeholder="0.123"></input>
           <br></br>
           <br></br>
           <button class="withdrawCSS"onClick={props.getContractBalance}>Get Contract Balance in Ether: 
           </button><span>  &nbsp;: {props.balance}</span>
           
           <br></br>
           <br></br>
           <button class="withdrawCSS"onClick={props.withdrawContractProfits}>Withdraw Contract Profits...
           </button>
           <br></br>
           
           </div>
        </div>
    )
}

export default Management
