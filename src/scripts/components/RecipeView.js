import React from 'react'
import {Card, CardActions, CardText, CardMedia, CardTitle} from 'material-ui/lib/card';
import RaisedButton from 'material-ui/lib/raised-button';


export default class RecipeView extends React.Component {

  constructor(props) {
    super(props)
      this.style = {
      textAlign: "center",
      width: "100%",
      height: "100%",
      margin: "10px, 0, 10px, 0"
    }

  }

  renderRecipeCard (item, index) {
    return (
      <Card key={index} style={this.style}>
        <CardMedia overlay={<CardTitle subtitle={item}/>}>
          <img src ="http://freshbynorthwest.com/wp-content/uploads/2012/01/Sauteed-Cod-with-Basic-Lemon-Herb-Sauce.jpg"/>
        </CardMedia>
        <CardText
          actAsExpander={true}
          showExpandableButton={true}>
        {index}: Top Three Ingredients<br/>
        </CardText>
        <CardText expandable={true}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
          Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
          Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
        </CardText>
        <CardActions>
          <button>Comment</button>
          <button>Complete</button>
          <button>Save</button>
        </CardActions>
      </Card>
    )
  }
  
  render() {
    return (
      <div>
      <h2>{this.props.username}'s Recipes</h2>
      {this.props.recipes.map((item, index) => this.renderRecipeCard(item, index))}
      </div>
    ) 
  }
}