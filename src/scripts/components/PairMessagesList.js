import React from 'react';
import ReactDOM from 'react-dom';
import Rebase from 're-base';
import Avatar from 'material-ui/lib/avatar';


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
      },
      photo: "http://33.media.tumblr.com/f0d754dadf47a5aa79d6975735ee21fe/tumblr_inline_ne2bnsjzI41qfq25i.png"
    }
  }
  
  renderInput(){
    return(
      <form onSubmit={(event) => {
            event.preventDefault();
            this.state.submitChat(this.refs.msg.value)
            ReactDOM.findDOMNode(this.refs.msg).value = "";
          }}>
        <input className="somo-input" placeholder="Add a comment..." ref='msg' />
      </form>
    )
  }

  renderChats() {
    return(    
          <div className="comment-area">
            {this.state.messages.map((message, index) => this.renderMessage(message, index))}
          </div>
    )
  }

  renderMessage(message, index){    
    return (
      <div className="somo-message" key={index}>
        <Avatar 
          classname="avatar-comment"
          src={this.state.photo} 
          size={50}
          style = {this.avatar}
          paddingTop="3%"
          paddingLeft="2%"
          verticalAlign="middle"
        />
        <span className="somo-text">
          <strong>{message}</strong>
        </span>
      </div>
    )
  }

  render() {
    return (      
      <div className="comment-boxes">
        {this.renderInput()}
        {this.renderChats()}
      </div>

    )
  }
}


