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

	```sh
   mkdir etherflow
   git clone https://github.com/kichong/Truffle-React-Ether-Flow.git
   cd etherflow
    ```

2. In different terminal window, run Ganache CLI on port 8545 (the default).

	```sh
	ganache-cli
    ```

3. In etherflow director, compile contracts, migrate contracts to locally running ganche-cli on port 8545.

	
	`truffle compile`
  `truffle migrate --reset`
 
    
4.  Run contract tests.

	```sh
	truffle test
    ```

5. Copy seedwords or mnemonic from Ganache-CLI.

6. Open browser with metamask, log into metamask with above seed words, set it to a private network (localhost 8545).

7. Run the frontend on http://localhost:3000).

	```sh
	npm run start
    ```
    
 
