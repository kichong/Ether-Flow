# Design Pattern Decisions

### Fail Early and Fail Loud
All the functions which change the state implement require conditions early in the function logic. This throws an exception as early as possible if the condition is not met to reduce unnecessary code execution.

### Restricting Access
Only specific addresses are permitted to use certain functions depending on their role in the system. Since requestors are the ones who post the initial bounty reward, only requestors are allowed to activate the circuit breaker and select who can claim the reward bounty. Only the `chosenWordsmith` address selected by the requestor is allowed to collect the reward bounty. Requestors are also not allowed to answer their own request.

### Pull Over Push Payments/ Withdrawal Pattern
The logic for rewarding bounties is separated into two functions instead of one direct transfer function. The first function, `selectWordsmith` designates which address is permitted to collect the reward and does not transfer any funds. The second function, `claimReward`, allows the `chosenWordsmith` to collect the reward by withdrawing the funds from the contract to their account.

### Circuit Breaker/ Emergency Stop
The circuit breaker in the form of a `stopInEmergency` modifier stops or pauses functions in case a bug or bad actor is trying to manipulate funds. The modifier applies to functions that involve increasing the reward amount using the `boostReward` function or withdrawing the reward using the `claimReward` function. The circuit breaker can only be activated and deactivated by the address who funded the initial reward and only applies to that address's request.

### State Machine
The contract has different stages where certain functions can only be used after other functions have already been called. The table below demonstrates the different stages in the contract and when each function can be used. The **bold** functions need to be called before moving to the next stage. For example, in stage 1, first function that needs to be called is the `newFlowRequest` function, which allows the `postNewFlow` function to be used as a response in stage 2. Stage 2 also allows the `boostReward` function to be called and another `newFlowRequest` function to be called if necessary. In stage 3, the `selectWordsmith` function is allowed since the `postNewFlow` function has been called. In stage 4, the `claimReward` function is allowed since the `selectWordsmith` function has been called.

| Stage 1        | Stage 2        | Stage 3         |  Stage 4         |
| -------------  |:-------------: | -------------:  | -------------:   |
| **_newFlowRequest_** | **_postNewFlow_**    | **_selectWordsmith_** |  **_claimReward_**     |
|                | boostReward    | postNewFlow     |  selectWordsmith |
|                | newFlowRequest | boostReward     |  postNewFlow     |
|                |                | newFlowRequest  |  boostReward     |
|                |                |                 |  newFlowRequest  |

### Mortal
This contract imports the Destructible.sol contract from the Open Zeppelin library. This allows the owner to destroy the contract and remove it from the blockchain. 

### Speed Bump
Speed bumps slow down actions if there is a malicious actor found. Not used in this contract.

### Auto Deprecation
Auto deprecation closes contract after a certain amount of time. Not used in this contract.
