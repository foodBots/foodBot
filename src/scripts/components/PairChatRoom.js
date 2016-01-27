import React from 'react'
import PairMatch from './PairMatch'

class PairChatRoom extends React.Component {

  render() {
    return (
      <div>
      You paired son
      <PairMatch 
        messages={this.props.messages} 
        submitChat={this.props.submitChat}/>
        
      </div>
    )
  }
}

export default PairChatRoom