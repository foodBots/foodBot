import React from 'react';
import Slider from 'react-slick';
import RecipeView from './RecipeView'
import ReactDOM from 'react-dom';
import PairMessagesList from './PairMessagesList'
import {Card, CardActions, CardText, CardMedia, CardTitle} from 'material-ui/lib/card';
import RaisedButton from 'material-ui/lib/raised-button';
import $ from 'jquery';

export default class RecipeSlider extends React.Component {

  constructor(props) {
    super(props)
      this.style = {
      textAlign: "center",
      margin: "10px, 0, 10px, 0",
      height: "20%"

    }
  }

  handleClick() {
    event.preventDefault()
    console.log("handle click")
  }

  renderRecipeCard (item, index) {
    return (
      <div key={index} style={{height:"80vh"}}>      
      <Card key={index}>      
        <CardMedia style={this.style} overlay={<CardTitle title={item.name}/>}>
          <img style={{height: "30%"}}src={item.image} />
        </CardMedia>
        <CardText>
          <h4>Ingredients:</h4>
          <ul>
          <li>"1 thing"</li>
          <li>"1 thing"</li>
          <li>"1 thing"</li>
          <li>"1 thing"</li> 
          </ul>
          Total Cost: <strong>"1 million dollars"</strong>         
        </CardText>      
        <CardActions style={this.style}>
          <RaisedButton label="Add to Cart" primary={true} onClick={this.handleClick} />
      </CardActions>        
      </Card>
      </div>
    )
  }

  render(){
    let recipes = this.props.recipes
    const settings = {
      dots: false,
      infinite: true,
      speed: 800,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      swipe: true,
      lazyLoad: false
    };
    return (
      <div>
      <Slider {...settings}>
        {recipes.map((item, index) => this.renderRecipeCard(item, index))}
      </Slider>
      </div>
    )

  }
}