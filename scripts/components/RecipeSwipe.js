import React from 'react';
import autobind from 'autobind-decorator';
import ReactSwipe from 'react-swipe'
import Header from './Header'
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardText from 'material-ui/lib/card/card-text';
import CardMedia from 'material-ui/lib/card/card-media';


import $ from 'jquery';

@autobind
class Recipe extends React.Component {
  
  constructor() {
  super();
    this.style = { 
      width: "25%",
      textAlign: "center"
    }
    //This is an array of objects we get from the server
    this.cards = [1,2,3,4,5]
  }

  next = () => {
    this.refs.ReactSwipe.swipe.next()
  }

  renderCard = (element) => {

    return (
      <div>
         <Card style={this.style}>
        <CardMedia>
        <img src ="http://25.media.tumblr.com/tumblr_m2zle0WyK31r5wwyho1_500.png"/>
        </CardMedia>
        <CardText>
          Hello {element}
        </CardText>
        <CardActions>
          <button onClick={this.next}>Next</button>
          <button onClick={this.yes}>Yes</button>   
        </CardActions>
      </Card>     
   
      </div>
    )
  }

  // this.cards.map(this.renderCard(element))


  render() {
    var testArray = this.cards.map(this.renderCard)
    console.log(testArray)
    return (
      <div> 
      <ReactSwipe
        ref="ReactSwipe"
        continuous={true}
        >
        {this.cards.map(this.renderCard)}
      </ReactSwipe>

      </div>
    )
  }
}

export default Recipe;