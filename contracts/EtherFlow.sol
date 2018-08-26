pragma solidity ^0.4.24;

/// @title Ether Flow
/// @notice Bounty Dapp for Consensys Developer Academy 2018 Final Project
/// @author Ki Chong Tran
contract EtherFlow {

    ///@notice Counters to track and identify the requests (requestCount) and submissions(flowCount)
    ///@dev Initialize counters to zero
    uint requestCount = 0;
    uint flowCount = 0;

    ///@notice Reward amount for each request
    ///@dev Reward initialized to zero
    uint reward = 0;

    ///@notice Events to notify when a new request or flow has been submitted
    ///@dev Users would be notified when there was a new request and the amount of the posted reward
    event LogFlowRequested (uint indexed reward);
    ///@dev Requestors would be notified when their request was responded to
    event LogFlowSubmitted (uint indexed);

    ///@notice Structure for each new request containing all the necessary information
    struct request {
        string question;
        uint reward;
        address requestor;
        uint requestCount;
    }

    ///@dev Stores all the requests in an array
    request[] public requestArray;

    ///@notice Make a new request by posting a question and sending an ether bounty
    ///@dev Question, reward, requestor address, and request count is stored in the requestArray
    ///@param _question New question being asked
    ///msg.value or amount of reward or bounty, must be greater than 0
    function newFlowRequest(string _question) public payable {
        require (msg.value > 0);
        uint _reward = msg.value;
        emit LogFlowRequested(_reward);
        requestCount = requestCount+1;
        requestArray.push(request({
            question: _question,
            reward: _reward,
            requestor: msg.sender,
            requestCount: requestCount
            }));
        assert(requestArray[requestCount-1].reward >= msg.value);
    }

    ///@notice Structure for each new flow submission
    struct flow {
        string flow;
        address wordsmith;
        uint requestCount;
        uint flowCount;
    }

    ///@notice Stores all flows in an array
    flow[] public flowArray;

    ///@notice Wordsmith can post a new flow in response to a question
    ///@dev Flow, wordsmith address, requestCount identifier, and flowCount is stored in flowArray
    ///@param _flow Lyric, poem, or rap that answers the question
    ///@param _requestCount Number identifier that corresponds to the question being answered
    /// Uint id is used so that requestCount number 1 corresponds to the first element in the array
    ///@return True if flow successfully submitted, false otherwise
    function postNewFlow(string _flow, uint _requestCount) public returns(bool) {
        uint id = _requestCount-1;
        require(msg.sender != requestArray[id].requestor);
        flowCount = flowCount+1;
        flowArray.push(flow({
            flow: _flow,
            wordsmith: msg.sender,
            requestCount: _requestCount,
            flowCount: flowCount
        }));
        return true;
        emit LogFlowSubmitted(_requestCount);
        }

    ///@notice Maps requestCount identifier to address of the wordsmith that is selected by the requestor
    mapping (uint => address) public chosenWordsmith;

    ///@notice Wordsmith is notified if selected so they can collect their reward
    event LogWordsmithChosen (address);

    ///@notice Flow requester selects wordsmith that will be able to claim reward
    ///@dev Only the requestor is able to select the winning wordsmith
    /// Uint idR is used so that requestCount number 1 corresponds to the first element in the array and so on
    /// Uint idF is used so that flowXount number 1 corresponds to the first element in the array and so on
    ///@param _flowCount Identifies the flow and wordsmith who submitted the flow
    ///@param _requestCount Identifies the request
    function selectWordsmith(uint _flowCount, uint _requestCount) public {
        uint idR = _requestCount-1;
        uint idF = _flowCount-1;
        require(requestArray[idR].requestor == msg.sender);
        require(requestArray[idR].reward > 0);
        require(requestArray[idR].requestCount == flowArray[idF].requestCount);
        chosenWordsmith[requestCount] = (flowArray[idF].wordsmith);
        emit LogWordsmithChosen(flowArray[idF].wordsmith);
    }

    ///@notice ChosenWordsmith can claim their reward
    ///@dev Only the chosenWordsmith can claim the reward
    /// Reward amount is transfered to the chosenWordsmith and the reward is set to zero
    ///@param _requestCount To identify which request the reward is in
    function claimReward(uint _requestCount) public stopInEmergency {
        uint id = _requestCount-1;
        require(msg.sender == chosenWordsmith[_requestCount]);
        require(requestArray[id].reward > 0);
        uint claimedReward = requestArray[id].reward;
        requestArray[id].reward = 0;
        chosenWordsmith[_requestCount].transfer(claimedReward);
    }

    ///@notice Event to notify that a request reward has been boosted
    event LogRewardIncreased(uint);

    ///@notice Boost question reward
    ///@dev Anyone can increase the reward amount of a request by sending in more etherflow
    ///@param _requestCount Identifies which request to send ether to
    function boostReward(uint _requestCount) public payable stopInEmergency {
        uint id = _requestCount-1;
        require(msg.value > 0);
        requestArray[id].reward += msg.value;
        assert(requestArray[id].reward >= msg.value);
        emit LogRewardIncreased(requestArray[id].reward);
    }

    ///@notice Sees the reward amount for any request
    ///@param _requestCount Identifies which request to see the reward from
    ///@return rewardAmount
    function seeRewardAmount(uint _requestCount) public view returns(uint rewardAmount) {
      rewardAmount = requestArray[_requestCount-1].reward;
      return rewardAmount;
    }

    ///@notice Gets the question for any request
    ///@param _requestCount Identifies which request to get the question from
    ///@return question
    function getQuestion(uint _requestCount) public view returns(string question) {
      question = requestArray[_requestCount-1].question;
      return question;
    }

    ///@notice Gets the requestor address for any request
    ///@param _requestCount Identifies which request to get the requestor address from
    ///@return requestorAddress
    function getRequestor(uint _requestCount) public view returns(address requestorAddress) {
    requestorAddress = requestArray[_requestCount-1].requestor;
    return requestorAddress;
    }

    ///@notice Gets the flow and address of a wordsmith
    ///@param _flowCount Identifies which flow to get the flow and address from
    ///@return flowPoem the submitted flow
    ///@return wordsmith the address of the wordsmith
    function getFlowArray(uint _flowCount) public view returns(
      string flowPoem,
      address wordsmith) {
        flowPoem = flowArray[_flowCount-1].flow;
        wordsmith = flowArray[_flowCount-1].wordsmith;
        return (flowPoem, wordsmith);
    }

    ///@notice Gets the length of the current requestArray for use on UI
    ///@return Uint length of the requestArrray
    function getLength() public view returns(uint length) {
      length = requestArray.length;
      return length;
    }

    ///Circuit Breaker
    ///@notice Requestor is the account that submits a new question and can activate circuit breaker for their requests

    ///@notice circuit breaker is set to off
    bool private stopped = false;

    ///@notice requestor can only stop movements of rewards for their own Requests
    ///@dev turns on the circuit breaker stopInEmergency
    ///@param _requestCount identifies the request to stop and checks the requestor is also the message sender
    function stopRewardMovements(uint _requestCount) public {
        require(msg.sender == requestArray[_requestCount-1].requestor);
        stopped = !stopped;
    }

    ///@notice modifier that can pause functions
    modifier stopInEmergency { require(!stopped); _; }

}
