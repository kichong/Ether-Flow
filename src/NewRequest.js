import React, { Component } from 'react'
import EtherFlowContract from '../build/contracts/EtherFlow.json'
import getWeb3 from './utils/getWeb3'


class NewRequest extends Component {
  constructor(props) {
    super(props)

    this.state = {
      owner: '0x0',
      question: '',
      reward: '',
      flowType: '',
    }
  }
}

export default NewRequest
