import React from 'react';
import ReactSwipe from 'react-swipe'
import Header from './Header.js'
import {Card, CardActions, CardText, CardHeader, CardTitle} from 'material-ui/lib/card';
import $ from 'jquery';
import RaisedButton from 'material-ui/lib/raised-button';
import Avatar from 'material-ui/lib/avatar';

class RecipesBuy extends React.Component {
  componentWillMount(){
    this.props.getTotal();
  }

  constructor(props) {
    super(props);
    this.cardStyles = {
      display: 'block',
      textAlign: 'left',
      width: '70%'
    }
    this.buttonStyles = {
      display: 'block',
      textAlign: 'center',
      width: '300px'
    }
  }
  renderCard(element, index) {
    return (
      <div key={index} style={this.cardStyles}>
        <Card >
        <CardHeader
          title={element.name}
          avatar={element.image}
          subtitle={element.price}
          actAsExpander={true}
          showExpandableButton={true}/>
        <CardText expandable={true}>
          <CardActions>
            <RaisedButton label="Remove" primary={true} onClick={this.props.removeOrder.bind(this, element)}/>
          </CardActions>
        </CardText>
        </Card>
      </div>
    )
  }
  
  render() {
    const recipes = this.props.cart
    return(
      <div className="buyrecipe-container">
        <h1>Your Recipes Order</h1>
        <br />
        {recipes.map((element, index) => this.renderCard(element, index))}
        <Card style={this.cardStyles}>
          <CardHeader
            title={"Total Order: $"+this.props.total}/>
        </Card>
        <br />
        <RaisedButton 
            style={this.buttonStyles} 
            secondary={true} 
            label="Complete Order" 
            onClick={this.props.orderCheckout}/>
      </div>
    )
  }
}

export default RecipesBuy;