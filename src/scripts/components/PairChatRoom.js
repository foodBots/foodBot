import React from 'react'
import Header from './Header'
import PairMatch from './PairMatch'

class PairChatRoom extends React.Component {

  render() {
    return (
      <div>
      <Header redirect={this.props.location.state.redirect}/>
        <div>
            You paired son
           <PairMatch 
            messages={this.props.location.state.messages} 
            submitChat={this.props.location.state.submitChat}/>        
        </div>
      </div>
    )
  }
}

export default PairChatRoom