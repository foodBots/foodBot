import React from 'react'
import Header from './Header'
import PairMatch from './PairMatch'
import ReactDOM from 'react-dom';
import {FlexColumn, FlexRow} from 'react-flexbox';
import View from 'react-flexbox';
import PairMessagesList from './PairMessagesList'
import {Card, CardActions, CardText, CardMedia} from 'material-ui/lib/card';

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

                 <Card style={this.style}>
                  <CardMedia>
                  <img src ="http://freshbynorthwest.com/wp-content/uploads/2012/01/Sauteed-Cod-with-Basic-Lemon-Herb-Sauce.jpg"/>
                  </CardMedia>
                  <CardText>
                    Title of Food<br/>
                    Top Three Ingredients<br/>
                    Hello
                  </CardText>
                  <CardActions>
                    <button>Next</button>
                    <button>Yes</button>
                  </CardActions>
                </Card>
          </View>
          
          <View auto row>
            <View column width="20%"><View className="red"><PairMatch/></View></View>
          </View>
          <View column width="30%" className="green">
          This is where your PARTNER GOES go
             <Card style={this.style}>
                  <CardMedia>
                  <img src ="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT9YQ1m4Hgi4YazU04e7DD1tstgs1ce4AoFv-IoDk0yqRHylMSBiMoUSg3h"/>
                  </CardMedia>
                  <CardText>
                    Title of Food<br/>
                    Top Three Ingredients<br/>
                    Hello
                  </CardText>
                  <CardActions>
                    <button>Next</button>
                    <button>Yes</button>
                  </CardActions>
                </Card>
          </View>
        
        </View>
              <View column height="200px">
              <View column auto>
            <View className="green" height="20px">Green</View>
            <View className="red" height="20px">Red</View>
          </View>
          <View className="green">All the rest</View>
        </View>
      </View>
        
      </div>
    )
  }
}

export default PairChatRoom

