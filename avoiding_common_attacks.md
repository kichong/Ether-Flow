# Avoiding Common Attacks

### Reentrancy
Reentrancy becomes a vulnerability when an external contract call is necessary before finishing the function work. In this contract, external contracts are not called.


### Cross-function Race Conditions
Cross-function race conditions can be problematic if the contract has multiple functions that modify the same state, which this contract has. For paying out bounties, a withdrawal design pattern is used to separate the contract accounting logic and the transfer logic. Also in the `claimReward` function, the internal accounting logic is finished before any transfer is made.


### Transaction Ordering and Timestamp Dependence
This type of attack involves how transactions are included in the blockchain and is vulnerable to manipulation by miners or attackers manipulating the order of transactions for their benefit. Since this contract does depend on transaction ordering or the timestamp.

### Integer Overflow and Overflow
The three integer variables that the user can manipulate are `flowCount`, `rewardCount`, and `reward`. The `flowCount` and `rewardCount` can only be incremented and not set by the user so they are not vulnerable to overflows or underflows. The `reward` amount can be set by the user using the `boostReward` and `newFlowRequest` functions, but the `reward` amount can only be set by sending ether so can not be set arbitrarily by the user. In the `boostReward` function, a require condition and assert condition is used to protect against underflows.

### Denial of Service
A denial of service attack makes a function unusable by throwing an exception before the function can fully execute. This contract avoids that attack by using pull over push methods or the withdrawal pattern for transferring funds.

### Force Sending Ether
This contract does not depend on the contract balance for its logic so it is not in danger from attacks that force send either. 
