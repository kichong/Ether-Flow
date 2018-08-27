# Ether Flow Bounty Dapp
Consensys Academy 2018 Developer Program Final Project - Ether Flow Bounty Dapp

### Description
Ether Flow is an ethereum bounty dapp used for getting answers to questions and earning money (ether) by answering questions.
Questions should be answered using "flows" - lyrics, poems, or raps. 

#### User Stories
* Requestors:
  * post a question and incentivise other users to answer using bounties or rewards.
  * select the wordsmith they thought had the best answer to collect the reward.
* Wordsmiths:
  * answer posted questions using "flows" - lyrics, poems, raps, etc.
  * should try to impress the requestor with something clever or funny.
  * who are selected by the requestor, can collect the reward that was posted.
* Anyone:
  * can view a list of the posted questions and corresponding answers or flows.
  * boost the reward in a post to increase the incentives for answering the question.
  
### Set Up
Dependencies: Node, Truffle and Ganache CLI.

1. Create new directory, clone the repo, move into the directory.

```
    mkdir etherflow
    git clone https://github.com/kichong/Ether-Flow.git
    cd etherflow
```

2. Run Ganache CLI on port 8545 (the default).

```
    ganache-cli
```

3. In etherflow directory, compile contracts, migrate contracts to locally running ganche-cli on port 8545.

```	
    truffle compile
    truffle migrate --reset
```
 
    
4.  Run contract tests.

```
    truffle test
```

5. Copy seedwords or mnemonic from Ganache-CLI.

6. Open browser with metamask, log into metamask with above seed words, set it to a private network (localhost 8545).

7. Run the frontend on http://localhost:3000).

```
    npm run start
```
    
 ### User Interface
 I used the truffle react box to build the user interface. I have no front-end or web development experience so the user interface is very rudimentary and incomplete as I did not have time to finish building all the front-end functionality and features that I intended. However, the solidity contract is complete and its logic is working as intended. Complete functionality of the smart contract can be tested using `truffle test` or by copying and pasting the EtherFlow.sol code into remix.ethereum.org and deleting the zeppelin library references at the beginning and end of the contract.
 #### Completed UI features
 * Users are able to post new requests and send an ether bounty by completing the form then clicking the *Request New Flow* button
 * User current metamask account is displayed (refresh page after switched from accounts)
 * User can update UI with contract state by clicking on the *Update List* button (refresh page before updating list)
 * UI displays the user's submitted request
 #### Incomplete UI features
 * Users can submit a flow in response to a question/ request
 * Submitted flows are displayed next to corresponding question/ request
 * Requestors can choose wordsmith to collect bounty
 * Wordsmisths can collect the bounty
 * Anyone can boost a reward
