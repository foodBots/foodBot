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
        backgroundColor: "red"
    }
  }

  render() {
    return (
    <div>
    <View column className="border" height="60vh">
        <View row>
          <View column>Your pair! Make Friends! Be Merry</View>         
        </View>

        <View row>
          <View auto row>
            <View column width="20%"><View className="red"><PairMatch/></View></View>            
          </View>
            <View column width="10%" className="green">
            <PairMessagesList                
                style={this.style}
                messages={this.props.messages}
                submitChat={this.props.submitChat}/>
            </View>

          <View auto row>
            <View column width="20%"><View className="red"><PairMatch/></View></View>
          </View>          
          <View column width="30%" className="green">
                This is where your recipes go
                <RecipeView 
                  recipes={this.props.chosenRecipes}/>
          </View>
          
          <View auto row>
            <View column width="20%"><View className="red"><PairMatch/></View></View>
          </View>
          <View column width="30%" className="green">
          This is where your PARTNER GOES go
            <RecipeView 
              recipes={this.props.partnerRecipes}/>          
          </View>
        
        </View>
          
      </View>
        
      </div>
    )
  }
}

export default PairChatRoom

