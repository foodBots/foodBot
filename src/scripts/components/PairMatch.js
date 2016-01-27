import React from 'react';
import ReactDOM from 'react-dom'
import Avatar from 'material-ui/lib/avatar';
import styles from 'material-ui/lib/styles';

import PairMessagesList from './PairMessagesList'

//This is the chatform

const colors = styles.Colors;

export default class PairMatch extends React.Component {

  render() {
    return (
      <div>
      <div>
        <Avatar
            color={colors.deepOrange300}
            backgroundColor={colors.purple500}>A
          </Avatar>

         <Avatar
            color={colors.blue300}
            backgroundColor={colors.indigo900}>B
          </Avatar>            
      </div>

      <form onSubmit={(event) => {
            event.preventDefault();
            this.props.submitChat(this.refs.msg.value)
            ReactDOM.findDOMNode(this.refs.msg).value = "";
          }}>
        <input placeholder="SAY SOMETHING" ref='msg' />
      </form>
      <div>      
        Hello this is the chat window

        <PairMessagesList 
            messages={this.props.messages}/>
      </div>
      
      </div>
    )

  }
}
