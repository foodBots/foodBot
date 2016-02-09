import React from 'react';
import ReactDOM from 'react-dom';
import Rebase from 're-base'
let chatBase = Rebase.createClass("https://dazzling-inferno-511.firebaseio.com/comments")

//This is the chatform

export default class PairMessagesList extends React.Component {

    componentDidMount() {
        chatBase.syncState('user' + this.props.activeProfId + 'rec' + this.props.activeItemId, {
        context: this,
        state: 'messages',
        asArray: true
        })
    }

  constructor(props){
    super(props)
    this.state = {
      messages: [],
      submitChat: (message) => {
        this.setState({messages: this.state.messages.concat(message)})
      }
    }
  }
  
  renderInput(){
    return(
      <form onSubmit={(event) => {
            event.preventDefault();
            this.state.submitChat(this.refs.msg.value)
            ReactDOM.findDOMNode(this.refs.msg).value = "";
          }}>
        <input placeholder="SAY SOMETHING" ref='msg' />
      </form>
    )
  }

  renderChats() {
    return(    
          <ul className="comment-area">
            {this.state.messages.map((message, index) => this.renderMessage(message, index))}
          </ul>
    )
  }

  renderMessage(message, index){
    return (
      <li className="message" key={index}>{this.props.username}: {message}</li>
    )
  }

  render() {
    return (      
      <div>
        {this.renderChats()}
        {this.renderInput()}
      </div>

    )
  }
}


