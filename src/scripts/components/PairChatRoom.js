import React from 'react'
import Header from './Header'
import PairMatch from './PairMatch'
import PairMessagesList from './PairMessagesList'
import RecipeView from './RecipeView'


import ReactDOM from 'react-dom';
import {FlexColumn, FlexRow} from 'react-flexbox';
import View from 'react-flexbox';

class PairChatRoom extends React.Component {
  
  constructor() {
  super();
    this.style = {
        flexWrap: "wrap",
        textAlign: "center",
        backgroundColor: "lightblue",
        margin: "5 0 5 0"
    }
  }

  render() {
    return (
    <div>
    <View column className="border" height="60vh">
        <View row>
          <View column><h2>Your pair! Make Friends! Be Merry! ETC</h2></View>         
        </View>

        <View row style={this.style} >
        
            <View column width="20%" className="green">
            <PairMessagesList                
                style={this.style}
                messages={this.props.messages}
                username={this.props.username}
                submitChat={this.props.submitChat}/>
            </View>

          <View auto row>
            <View column width="20%"><View className="bubble">
                <PairMatch
                  username={this.props.username} />
            </View></View>
          </View>          
          <View column width="30%">
                <RecipeView 
                  username={this.props.username}
                  recipes={this.props.chosenRecipes}/>
          </View>
          
          <View auto row>
            <View column width="20%"><View>
              <PairMatch
                  username={this.props.match}/>
            </View></View>
          </View>
          <View column width="30%">
            <RecipeView 
              username={this.props.match}
              recipes={this.props.matchRecipes}/>          
          </View>
        
        </View>
          
      </View>
        
      </div>
    )
  }
}

export default PairChatRoom

