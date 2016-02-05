import React from 'react';
import ReactSwipe from 'react-swipe'
import Header from './Header.js'
import {Card, CardActions, CardText, CardHeader, CardTitle} from 'material-ui/lib/card';
import $ from 'jquery';
import RaisedButton from 'material-ui/lib/raised-button';
import Avatar from 'material-ui/lib/avatar';


class RecipesBuy extends React.Component {
  constructor(props) {
    super(props);
    this.cardStyles = {
      display: 'block',
      textAlign: 'center',
      width: '450px'
    }
    this.buttonStyles = {
      display: 'block',
      textAlign: 'center',
      width: '450px'
    }
  }
  renderCard(element, index) {
    return (
      <div key={index} style={this.cardStyles}>
        <Card >
        <CardHeader
          title={element}
          avatar="https://lh3.googleusercontent.com/5UWFVuKC1bw63TzPDoaRT1VngwcoiJdOP8xPJs6BsFF8fYCYk6wVTDUwP3SEaXzufEpnfvQWwRpDhofQ1IqStw=s90"
          subtitle="Subtotal $25.00"
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          Veggie $5.75 <br/>
          Meat $5.75 <br/>
          Sauce $5.75 <br/>
          Bread $ 5.75 <br/>
          <CardActions>
            <RaisedButton label="Delete from order" primary={true}  />
          </CardActions>
        </CardText>
        </Card>
      </div>
    )
  }
  render() {
    const recipes = ['Recipe 1','Recipe 2','Recipe 3','Recipe 4'];
    return(
      <div className="buyrecipe-container">
        <h1>Your Recipes Order</h1>
        <br />
        {recipes.map((element, index) => this.renderCard(element, index))}
        <Card style={this.cardStyles}>
          <CardHeader
            title="Total: $100.00"
          />
        </Card>
        <br />
        <RaisedButton style={this.buttonStyles} secondary={true} label="Check Out with Fast Bucket" />
      </div>
    )
  }
}

export default RecipesBuy;