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
        return this.setState({ account: accounts[0] })
      }).then((result) => {
        return this.setState({ contract: etherflowInstance })
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

              <form onSubmit={this.onSubmit.bind(this)}>
                <h4>Request New Flow</h4>
                <div>
                  <label>Question</label>
                  <input
                    question={this.state.question}
                    onChange={event => this.setState({ question: event.target.value })}
                  /><br/>

                  <label>Reward</label>
                  <input
                    reward={this.state.reward}
                    onChange={event => this.setState({ reward: event.target.value })}
                  /><br/>

                </div>
                <button>Request New Flow</button><br/>
              </form>

              <hr />
              <button>Post New Flow</button>
              <hr />
                  <div>
              <p>Current Question is: {this.state.question} </p>
              <p>Current Reward is :{this.state.reward} ether</p>
                  </div>
              <hr />
              <button>Explore</button>
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
