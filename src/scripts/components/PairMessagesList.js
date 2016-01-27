import React from 'react';

export default class PairMessagesList extends React.Component {

  constructor(props){
    super(props)
  }

  renderMessage(message, index){
    return (
      <li key={index}>{index}: {message}</li>
    )
  }

  render() {
    return (
      <div>
      <ul>
      {this.props.messages.map((message, index) => this.renderMessage(message, index))}
      </ul>
      </div>
    )
  }
}


