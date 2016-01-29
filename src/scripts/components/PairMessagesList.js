import React from 'react';
import ReactDOM from 'react-dom';

//This is the chatform

export default class PairMessagesList extends React.Component {

  constructor(props){
    super(props)
  }

  renderInput(){
    console.log("input box rendered")
    return(
      <form onSubmit={(event) => {
            event.preventDefault();
            this.props.submitChat(this.refs.msg.value)
            ReactDOM.findDOMNode(this.refs.msg).value = "";
          }}>
        <input placeholder="SAY SOMETHING" ref='msg' />
      </form>
    )
  }

  renderChats() {
    console.log("render chats done")
    return(    
          <div>
            {this.props.messages.map((message, index) => this.renderMessage(message, index))}
          </div>
    )
  }

  renderMessage(message, index){
    return (
      <p className="bubble" key={index}>{this.props.username}: {message}</p>
    )
  }

  render() {
    return (      
      <div className="comment-area">
      {this.renderInput()}
      {this.renderChats()}
      </div>
    )
  }
}


