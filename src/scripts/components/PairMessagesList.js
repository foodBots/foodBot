import React from 'react';
import ReactDOM from 'react-dom';
import Rebase from 're-base'

//This is the chatform
let base = Rebase.createClass('https://dazzling-inferno-511.firebaseio.com/shoppingCart')

export default class PairMessagesList extends React.Component {

    componentDidMount() {
        this.ref = base.syncState('user' + this.props.activeProfId + 'rec' + this.props.activeItemId, {
        context: this,
        state: 'messages',
        asArray: true
        })
    }

    componentWillUnmount() {
      base.removeBinding(this.ref);
    }

  constructor(props){
    super(props)
    this.state = {
      messages: [],
      submitChat: (message) => {
        this.setState({messages: this.state.messages.concat(this.props.name+": "+message)})
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
      <li className="message" key={index}>{message}</li>
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


