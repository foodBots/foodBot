import React from 'react'
import Header from './Header'
import PairMatch from './PairMatch'

class PairChatRoom extends React.Component {

  render() {
    return (
      <div>
        <div>
            You paired son
           <PairMatch
            messages={this.props.messages}
            submitChat={this.props.submitChat}/>
        </div>
      </div>
    )
  }
}

export default PairChatRoom