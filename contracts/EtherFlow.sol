pragma solidity ^0.4.24;

/// @title Ether Flow
contract EtherFlow {

    //address public requestor;
    uint requestCount = 0;
    uint reward = 0;
    uint flowCount = 0;

    event LogFlowRequested (uint indexed reward);
    event LogFlowSubmitted (uint indexed);

    struct request {
        string question;
        uint reward;
        address requestor;
        uint requestCount;
    }

    request[] public requestArray;

    ///@notice Post new request for a poem
    ///@param _question New question being asked
    function newFlowRequest(string _question) public payable {
        require (msg.value > 0);
        uint _reward = msg.value;
        emit LogFlowRequested(_reward);
        requestArray.push(request({
            question: _question,
            reward: _reward,
            requestor: msg.sender,
            requestCount: requestCount++
        }));
    }

    struct flow {
        string flow;
        address wordsmith;
        uint requestCount;
        uint flowCount;
    }

    flow[] public flowArray;

    ///@notice Wordsmith post new poem in response to question
    ///@param _flow Poem that answers the question
    ///@return true if flow successfully submitted, false otherwise
    function postNewFlow(string _flow, uint _requestCount) public returns(bool) {
        uint id = _requestCount-1;
        require(msg.sender != requestArray[id].requestor);
        flowArray.push(flow({
            flow: _flow,
            wordsmith: msg.sender,
            requestCount: _requestCount,
            flowCount: flowCount++

        }));
        return true;
        emit LogFlowSubmitted(_requestCount);
        }

    address public chosenWordsmith;

    event LogWordsmithChosen (address);

    ///@notice Flow requester selects wordsmith that will be able to claim reward
    ///@param _flowCount to select the Flow
    ///@param _requestCount to select the request
    function selectWordsmith(uint _flowCount, uint _requestCount) public {
        uint idR = _requestCount-1;
        uint idF = _flowCount-1;
        require(requestArray[idR].requestor == msg.sender);
        require(requestArray[idR].reward > 0);
        require(requestArray[idR].requestCount == flowArray[idF].requestCount);
        chosenWordsmith = (flowArray[idF].wordsmith);
        emit LogWordsmithChosen(flowArray[idF].wordsmith);
    }

    ///@notice ChosenWordsmith can claim their reward
    function claimReward(uint _requestCount) public stopInEmergency {
        uint id = _requestCount-1;
        require(msg.sender == chosenWordsmith);
        require(requestArray[id].reward > 0);
        uint claimedReward = requestArray[id].reward;
        requestArray[id].reward = 0;
        chosenWordsmith.transfer(claimedReward);
    }

    event LogRewardIncreased(uint);

    ///@notice Boost question reward
    function boostReward(uint _requestCount) public payable stopInEmergency {
        uint id = _requestCount-1;
        require(msg.value > 0);
        requestArray[id].reward += msg.value;
        assert(requestArray[id].reward >= msg.value);
        emit LogRewardIncreased(requestArray[id].reward);
    }

    //@notice to fetch newRequest reward element
    function seeRewardAmount(uint _requestCount) public view returns(uint rewardAmount) {
      rewardAmount = requestArray[_requestCount-1].reward;
      return rewardAmount;
    }

    function getQuestion(uint _requestCount) public view returns(string question) {
      question = requestArray[_requestCount-1].question;
      return question;
    }

    function getRequestor(uint _requestCount) public view returns(address requestorAddress) {
    requestorAddress = requestArray[_requestCount-1].requestor;
    return requestorAddress;
    }

    function getFlowArray(uint _flowCount) public view returns(
      string flowPoem,
      address wordsmith) {
        flowPoem = flowArray[_flowCount-1].flow;
        wordsmith = flowArray[_flowCount-1].wordsmith;
        return (flowPoem, wordsmith);
    }

    ///Circuit Breaker
    ///@notice Requestor is the account that submits a new question and can activate circuit breaker for their requests

    bool private stopped = false;


    function stopRewardMovements(uint _requestCount) public {
        require(msg.sender == requestArray[_requestCount-1].requestor);
        stopped = !stopped;
    }

    modifier stopInEmergency { require(!stopped); _; }
}
