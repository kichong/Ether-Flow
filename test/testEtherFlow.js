var EtherFlow = artifacts.require("EtherFlow");

contract("EtherFlow", function(accounts) {

  const requestor = accounts[0];
  const wordsmith1 = accounts[1];
  const wordsmith2 = accounts[2];
  const booster = accounts[3];
  const sentAmount = web3.toWei(2, "ether");

  // Use one of those acccounts to deploy the contract
  it("deploys a contract", async() => {
    const etherflow = await EtherFlow.deployed();
    assert.ok(etherflow, "the contract should be deployed");
  });

  // test newFlowRequest receives the correct reward and question
  it("newFlowRequest updates correct reward amount and question", async () => {
    const etherflow = await EtherFlow.deployed();
    await etherflow.newFlowRequest("will this work?", {
      from: requestor,
      value: sentAmount
    });
    const newReward = await etherflow.seeRewardAmount(1, {
      from: requestor
    });
    assert.equal(sentAmount, newReward, "the reward should be the same as the sentAmount");
    console.log(web3.fromWei(newReward).toString());
    const newQuestion = await etherflow.getQuestion(1, {
      from: requestor
    });
    assert.equal("will this work?", newQuestion, "the question should be same as what was entered");
  });

  // test postNewFlow receives the correct flow and address
  it("postNewFlow receives the correct flow and address", async () => {
    const etherflow = await EtherFlow.deployed();
    await etherflow.postNewFlow("It'll work, I go berzerk, twerk twerk", 1, {
      from: wordsmith1
    });
    const flow1 = await etherflow.getFlowArray(1, {
      from: requestor
    });
    assert.equal("It'll work, I go berzerk, twerk twerk", flow1[0], "the flow result and flow inputted should be the same");
    assert.equal(wordsmith1, flow1[1], "the address of the wordsmith should be the same as the addres of the person who posted the new flow");
  });

  // test multiple accounts can submit a new flow
  it("can receive flows from multiple accounts", async () => {
    const etherflow = await EtherFlow.deployed();
    await etherflow.postNewFlow("work? irrelevent, you know it does not matter, smoke weed every day", 1, {
      from: wordsmith2
  });
    const flow2 = await etherflow.getFlowArray(2, {
      from: requestor
    });
    assert.ok(flow2);
    console.log(flow2);
  });


/*
// test only requestor can select Wordsmith function

// test that only selected wordsmith can withdraw or claim the reward

// test that circuit breaker works

*/

  });
