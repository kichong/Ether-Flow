# Remix Function Tests
`newFlowRequest`
* address 1
* address 2

`getLength`
`getQuestion`
`getRequestor`
`requestArray`
`seeRewardAmount`
* displays correct info for each address that used `newFlowRequest`

`postNewFlow`
* address 3
** post flow 1 for question 1
** post flow 2 for question 2
* address 4
** post flow 2 for question 1
** post flow 2 for question 2

`getFlowArray`
`flowArray`
* displays correct for each address that used `postNewFlow`

`boostReward`
* address 5
`seeRewardAmount`
* displays boosted reward rewardAmount

`claimReward`
* no one can claim the reward- throws revert error

`selectWordsmith`
* only address 1 can use selectWordsmith function for requestCount 1 - all others revert
* event emitted with correct address of Wordsmith

`chosenWordsmith`
* argument = 1, returns correct address (address 3)
* other arguments, returns empty address

`getChosenWordsmith`
* requestCount = 1, returns correct address (address 3)
* other arguments, returns empty address

`selectWordsmith`
* only address 2 can use selectWordsmith function for requestCount 2 - all others revert

`chosenWordsmith`
* argument = 2, returns correct address (address 4)

`getChosenWordsmith`
* requestCount = 2, returns correct address (address 4)

`claimReward`
* only address 4 can use the claimReward function - all others revert
* reward amount transferred to address 4 balance
* trying to use claimReward function again reverts

`stopRewardMovements`
* only address 1 can use stopRewardMovements circuit breaker function for requestCount 1
* can turn on

`claimReward`
* address 3 is not able to use claimReward functions when circuit breaker is on

`stopRewardMovements`
* only address 1 can use stopRewardMovements circuit breaker function for requestCount 1
* can turn off

`claimReward`
* address 3 is able to use claimReward functions when circuit breaker is turned back off
