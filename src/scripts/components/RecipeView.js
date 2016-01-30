import React from 'react'
import {Card, CardActions, CardText, CardMedia, CardTitle} from 'material-ui/lib/card';
import RaisedButton from 'material-ui/lib/raised-button';


export default class RecipeView extends React.Component {

  constructor(props) {
    super(props)
      this.style = {
      textAlign: "center",
      margin: "10px, 0, 10px, 0"
    }

  }

  renderRecipeCard (item, index) {
    return (
      <div>
      <Card key={index} style={this.style}>        
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
      </div>
    )
  }
  
  render() {
    return (
      <div>
      {this.props.recipes.map((item, index) => this.renderRecipeCard(item, index))}
      </div>
    ) 
  }
}