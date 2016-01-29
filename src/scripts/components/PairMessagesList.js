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
          <ul>
            {this.props.messages.map((message, index) => this.renderMessage(message, index))}
          </ul>
    )
  }

  renderMessage(message, index){
    console.log("render messages done")
    return (
      <li key={index}>{index}: {message}</li>
    )
  }

  render() {
    return (      
      <div className="chatBox">
      {this.renderInput()}
      {this.renderChats()}
      </div>
    )
  }
}


