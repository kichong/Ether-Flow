var EtherFlow = artifacts.require("EtherFlow");

contract("EtherFlow", function(accounts) {

  const requestor = accounts[0];
  const wordsmith1 = accounts[1];
  const wordsmith2 = accounts[2];
  const booster = accounts[3];
  const sentAmount = web3.toWei(2, "ether");

  // test the contract is deployed
  it("deploys a contract", async() => {
    const etherflow = await EtherFlow.deployed();
    assert.ok(etherflow, "the contract should be deployed");
  });

  // test newFlowRequest receives the correct reward and question
  it("newFlowRequest updates correct reward amount and question", async () => {
    const etherflow = await EtherFlow.deployed();
    await etherflow.newFlowRequest("sup Snoop?", {
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
    assert.equal("sup Snoop?", newQuestion, "the question should be same as what was entered");
  });

  // test postNewFlow receives the correct flow and address
  it("postNewFlow receives the correct flow and address", async () => {
    const etherflow = await EtherFlow.deployed();
    await etherflow.postNewFlow("La-da-da-da-dahh, It's the motherfuckin' D-O-double-G", 1, {
      from: wordsmith1
    });
    const flow1 = await etherflow.getFlowArray(1, {
      from: requestor
    });
    assert.equal("La-da-da-da-dahh, It's the motherfuckin' D-O-double-G", flow1[0], "the flow result and flow inputted should be the same");
    assert.equal(wordsmith1, flow1[1], "the address of the wordsmith should be the same as the addres of the person who posted the new flow");
  });

  // test multiple accounts can submit a new flow
  it("can receive flows from multiple accounts", async () => {
    const etherflow = await EtherFlow.deployed();
    await etherflow.postNewFlow("Hope you ready for the next episode, hey, hey, hey, hey... Smoke weed every day", 1, {
      from: wordsmith2
  });
    const flow2 = await etherflow.getFlowArray(2, {
      from: requestor
    });
    assert.ok(flow2, "different accounts should be able to submit a new flow");
    console.log(flow2);
  });

// test only requestor can use the selectWordsmith function
it("the selectWordsmith function selects the correct wordmsith", async () => {
  const etherflow = await EtherFlow.deployed();
  await etherflow.newFlowRequest("sup Snoop?", {
    from: requestor,
    value: sentAmount
  });
  await etherflow.postNewFlow("La-da-da-da-dahh, It's the motherfuckin' D-O-double-G", 1, {
    from: wordsmith1
  });
  await etherflow.selectWordsmith(1, 1, {
    from: requestor
  });
  const chosenWordsmith = await etherflow.getChosenWordsmith(1, {
    from: requestor
  });
  console.log(await etherflow.getChosenWordsmith(1, {from: requestor}));
  assert.equal(wordsmith1, chosenWordsmith, "the requestor should be able to select the chosenWordsmith");
});

// test that only selected wordsmith can withdraw or claim the reward
it("the selectWordsmith function selects the correct wordmsith", async () => {
  const etherflow = await EtherFlow.deployed();
  await etherflow.newFlowRequest("sup Snoop?", {
    from: requestor,
    value: sentAmount
  });
  const initialBalance = await web3.eth.getBalance(wordsmith1);
  console.log(initialBalance.toString());
  await etherflow.postNewFlow("La-da-da-da-dahh, It's the motherfuckin' D-O-double-G", 1, {
    from: wordsmith1
  });
  await etherflow.selectWordsmith(1, 1, {
    from: requestor
  });
  await etherflow.claimReward(1, {
    from: wordsmith1
  });
  const newBalance = await web3.eth.getBalance(wordsmith1);
  console.log(newBalance.toString());
  assert.isAtLeast(balance, initialBalance, "the chosenWordsmith should get the reward transferred to this balance");
});

// test that circuit breaker works



  });
