# VRF-Lottery Status/Issues/Ideas

## Small description of the project
It's a lottery utilizing Chain Link's VRF.
Running on kovan.

## Fundamental Issues
Currently the Lottery is controlled by a single enitity, the owner. He is the only one that can start and choose a winner of the lottery.
He is also the only one that can change the entry Price and the time amount the lottery is minimun running for.
## Ways to solve the problems
One way to fix this kind of centralized contract, is to introduce a governments protocol which would control all functions mentioned above.
This way a community could control the lottery.
## Technical Issues
1. 
  Normally you shouldn't use block.timestamp for future time based events. Using the block.timestamp method means that your contract may be vurnerable to miners having more         control over the outcome than regular users. In this case as long as you keep the minimun time the lottery is running, higher then 15 seconds (15 second rule). Currently it's in   the owners hand to decide that.
  
2. 
  The front-end is a mess due to me not utilizing the solidity events. 
  Callback hell:
  - Hard to read
  - Hard to update
  - Inefficient

## Ways to solve the problems
1) 
Using a future time event based on future block NUMBER is a better version to deal with these kind of contracts.

2)
I'll probaly redo the whole front-end utilizing the events and desgining with bootstrap.
