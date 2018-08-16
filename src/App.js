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
      account: '0x0',
      owner: '0x0',
      questions: [],
      flows: [],
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
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const etherflow = contract(EtherFlowContract)
    etherflow.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    let etherflowInstance
    // Get accounts.

    this.state.web3.eth.getAccounts((error, accounts) => {
      etherflow.deployed().then((instance) => {
        etherflowInstance = instance
        return this.setState({ account: accounts[0] })
      }).then((result) => {
        return this.setState({ questions: this.state.questions.push(etherflowInstance.getQuestion()) })
      }).then((result) => {
        return this.setState({ flows: this.state.flows.push(etherflowInstance.getFlowArray()) })
      })
    })
    
  }



  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Ether Flow</a>
        </nav>
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h2>What is a Flow?</h2>
              <p>a poem, a verse, a lyric, etc</p>
              <button>Request New Flow</button><br/>
              <button>Post New Flow</button>

              <h2>How it works?</h2>
              <ol>
                 <li>Ask a question</li>
                 <li>Post a reward</li>
                 <li>Choose the best response</li>
              </ol>
              <ol>
                 <li>Answer a question</li>
                 <li>Answer it beautifully</li>
                 <li>Get Money</li>
              </ol>
              <button>Explore</button>
              <p>Your account is: {this.state.account} </p>
              <p>My questions: {this.state.questions} </p>
              <p>My flows: {this.state.flows} </p>
            </div>

          </div>
        </main>
      </div>
    );
  }
}

export default App
