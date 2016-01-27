import React from 'react';
import ReactSwipe from 'react-swipe'
import {Card, CardActions, CardText, CardMedia} from 'material-ui/lib/card';

class Recipe extends React.Component {
  
  constructor() {
  super();
    this.style = { 
      width: "25%",
      textAlign: "center"
    }
    //This is an array of objects we get from the server
    //TODO: pass this down via the props
  }

  //TODO: Next and yes need to be different.
  next() {
    this.refs.ReactSwipe.swipe.next()    
  }

  yes () {
    this.refs.ReactSwipe.swipe.next()
  }

  renderCard (element) {
    return (
      <div key={element}>
        <Card style={this.style}>
        <CardMedia>
        <img src ="http://freshbynorthwest.com/wp-content/uploads/2012/01/Sauteed-Cod-with-Basic-Lemon-Herb-Sauce.jpg"/>
        </CardMedia>
        <CardText>
          Hello {element}
        </CardText>
        <CardActions>
          <button onClick={this.next.bind(this)}>Next</button>
          <button onClick={this.next.bind(this)}>Yes</button>   
        </CardActions>
      </Card>     
      </div>
    )
  }

  render() {
    var recipes = this.props.recipes
    return (
      <div> 
      <ReactSwipe
        ref="ReactSwipe"
        continuous={true}
        speed={800}
        >
        {recipes.map((elem, index) => this.renderCard(elem, index))}
      </ReactSwipe>

      </div>
    )
  }
}

export default Recipe;