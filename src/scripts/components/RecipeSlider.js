import React from 'react';
import Slider from 'react-slick';
import RecipeView from './RecipeView'
import ReactDOM from 'react-dom';
import PairMessagesList from './PairMessagesList'
import {Card, CardActions, CardText, CardMedia, CardTitle} from 'material-ui/lib/card';
import RaisedButton from 'material-ui/lib/raised-button';

export default class RecipeSlider extends React.Component {

  constructor(props) {
    super(props)
      this.style = {
      textAlign: "center",
      margin: "10px, 0, 10px, 0"
    }

  }
  renderRecipeCard (item, index) {
    return (
      <div key={index} >
      <Card key={index}>
        <CardMedia style={this.style} overlay={<CardTitle title={item.recipeId}/>}>
          <img src="http://danielfooddiary.com/wp-content/uploads/2014/03/boinnovation2.jpg"/>
        </CardMedia>
        <CardText>
        {index}: Link to Recipe Instructions? Or Ingredient List<br/>
        </CardText>
        <CardText>
          <PairMessagesList
              username={this.props.username}/>     
        </CardText>        
        <CardActions style={this.style}>
          <button>Upvote</button>
          <button>Mark Complete</button>
          <button>Save</button>
        </CardActions>
      </Card>
      </div>
    )
  }

  render(){
    let recipes = this.props.recipes
    console.log(this.props.username)
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