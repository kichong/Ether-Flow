import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'


class NewRequestArray extends Component {
  constructor(props) {
    super(props)

    this.state = {
      question: [],
      reward: [],
      requestor: [],
      requestCount: [],
    }
  }
}

export default NewRequestArray
