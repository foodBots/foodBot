import React from 'react';
import ReactSwipe from 'react-swipe'
import Header from './Header.js'
import {Card, CardActions, CardText, CardHeader, CardTitle} from 'material-ui/lib/card';
import $ from 'jquery';
import Delete from 'material-ui/lib/svg-icons/action/delete';
import LocalShipping from 'material-ui/lib/svg-icons/maps/local-shipping';
import IconButton from 'material-ui/lib/icon-button';
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
      width: '30px', 
      height: '30px'
    }
    this.buttonBackgroundStyle = {
      left: '87%',
      width: '100px'
    }
  }
  renderCard(element, index) {
    return (
      <div key={index} style={this.cardStyles}>
        <Card >
        <CardHeader
          title={element.name}
          avatar={element.image}
          subtitle={"$" + element.price}
          style={{position: 'absolute'}}
          />
        <CardActions>
        <IconButton style = {this.buttonBackgroundStyle} iconStyle={this.buttonStyles} onTouchTap={this.props.removeOrder.bind(this, element)}><Delete  color="#1DB272"/></IconButton>
        </CardActions>
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
            title={"Total Order: $" +this.props.total}/>
        </Card>
        <br />
           <RaisedButton
      label="Check Out Now"
      primary={true}
      onClick={this.props.orderCheckout}
      icon={<LocalShipping />}
    />
      </div>
    )
  }
}

export default RecipesBuy;