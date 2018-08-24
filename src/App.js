import React, { Component } from 'react'
import EtherFlowContract from '../build/contracts/EtherFlow.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      account: null,
      contract: null,
      reward: [],
      question: [],
      requestArray: [],
      request1: {},
      request2: {},
      request3: {},
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })

  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const etherflow = contract(EtherFlowContract)
    etherflow.setProvider(this.state.web3.currentProvider)
    var etherflowInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      etherflow.deployed().then((instance) => {
        etherflowInstance = instance
        return this.setState({ account: accounts[0], contract: etherflowInstance })
      })
    })
}

  onSubmit = async event => {
  event.preventDefault();

  const contract = await this.state.contract;
  const account = await this.state.account;

  await contract.newFlowRequest(this.state.question, {
    from: account,
    value: this.state.web3.toWei(this.state.reward, "ether"),
    gas: 300000
  });
};

  onClick = async event => {
    event.preventDefault();

    const contract = await this.state.contract;

//function constructor
let requestArray = [];

    for (var i = 1; i < 4; i++) {

      let reward0 = await contract.seeRewardAmount(i);
      let reward1 = await this.state.web3.fromWei(reward0, "ether").toNumber();
      let question1 = await contract.getQuestion(i);
      let requestor1 = await contract.getRequestor(i);

      const RequestObject = await function(i) {
        this.reward = reward1;
        this.question = question1;
        this.requestor = requestor1;
      }

      let newRequest = new RequestObject(i);
      requestArray[i] = newRequest;

      this.setState({ requestArray: requestArray });

  }

  this.setState({ request1: this.state.requestArray[1] });
  this.setState({ request2: this.state.requestArray[2] });
  this.setState({ request3: this.state.requestArray[3] });

}


  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Haiku Bounty</a>
        </nav>
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h2>What is Haiku Bounty?</h2>
              <p> Ask a question, post a reward, get a haiku</p>
              <p> Answer a question with a haiku, get a reward</p>

              <hr />
              <div>
                <form onSubmit={this.onSubmit.bind(this)}>
                  <h2>Request New Flow</h2>

                    <label>Question</label>
                    <input
                      onChange={event => { this.setState({ question: event.target.value })}
                    }
                    /><br/>

                    <label>Reward</label>
                    <input
                      onChange={event => { this.setState({ reward: event.target.value })}
                    }
                    /><br/>
                  <button>Request New Flow</button><br/>
                </form>
                </div>
              <hr />
              <h2>List of Requests</h2>
                  <div>
                    <button onClick={this.onClick.bind(this)} >
                    Update List
                    </button>
                  <ol>
                    <li> Request #1 </li>
                      <ul>
                        <li>Reward is: {this.state.request1.reward + ' ether'} </li>
                        <li>Requestor address: {this.state.request1.requestor} </li>
                        <li>Question is: {this.state.request1.question} </li>
                        <button>Answer</button>
                      </ul>
                    <li> Request #2 </li>
                    <ul>
                        <li>Reward is: {this.state.request2.reward + ' ether'} </li>
                        <li>Requestor address: {this.state.request2.requestor} </li>
                        <li>Question is: {this.state.request2.question} </li>
                        <button>Answer</button>
                    </ul>
                    <li> Request #3 </li>
                    <ul>
                        <li>Reward is: {this.state.request3.reward + ' ether'} </li>
                        <li>Requestor address: {this.state.request3.requestor} </li>
                        <li>Question is: {this.state.request3.question} </li>
                        <button>Answer</button>
                    </ul>
                  </ol>
                  </div>
              <hr />
              <p>Your account is: {this.state.account} </p>
            </div>

          </div>
        </main>
      </div>
    );
  }
}

export default App
