

const Account = (props) => {
    return (
        <div id="accountCSS"><div id="conta"><div id="personalCSS">Personal Information</div>
                     
           <br></br>
           You are currently connected with this address:<div style={{color: "rgb(172, 40, 22)"}}>{props.account}</div> 
           
           <br></br>
           You are currently connected to the <div style={{color: "rgb(172, 40, 22)"}}>{props.networkchainId}, {props.networkname} network</div>
           
           <br></br>
           <text style={{color: "rgb(172, 40, 22)"}}>Withdraw</text> your funds, directly to your address or choose someone elses to send the funds.
           The entered address will receive YOUR lottery winnings!
           <br></br>
           <button onClick={props.withdrawPriceContract}>Submit withdraw address</button>
           <input onChange={e => props.handleChangeWithdraw(e.target.value)} placeholder="Enter new address to receive the funds"></input>
           <br></br>
           <br></br>
           Enter the address of which you want to see the <text style={{color: "rgb(172, 40, 22)"}}>lottery profits</text> of.
           <br></br>
           <button onClick={props.getPersonalWinnings}>Check Winnings related to addresse {props.addrFunds}</button>
           <input onChange={e => props.handleChangeAddr(e.target.value)} placeholder="Enter new address to check winnings"></input>
           </div>
        </div>
    )
}

export default Account
