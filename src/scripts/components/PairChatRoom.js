import React from 'react'
import Header from './Header'
import PairMatch from './PairMatch'
import RecipeView from './RecipeView'
import RecipeSlider from './RecipeSlider'

import ReactDOM from 'react-dom';
import {FlexColumn, FlexRow} from 'react-flexbox';
import View from 'react-flexbox';

class PairChatRoom extends React.Component {
  
  constructor() {
  super();
    this.style = {
        flexWrap: "wrap",
        textAlign: "center",
        margin: "5 0 5 0"
    }
  }

  render() {
    return (
    <div>
    <h3>{this.props.username}</h3>
     <RecipeSlider
              username={this.props.username}
              recipes={this.props.chosenRecipes} 
              submitChat={this.props.submitChat}
              messages ={this.props.messages} />
    <h3>{this.props.match}</h3>
      <RecipeSlider
              username={this.props.match}
              recipes={this.props.matchRecipes}
              submitChat={this.props.submitChat}
              messages ={this.props.messages}  />          
    </div>
    )
  }
}

export default PairChatRoom

