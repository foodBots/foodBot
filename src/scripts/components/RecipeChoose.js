import React from 'react';
import ReactSwipe from 'react-swipe'
import Header from './Header.js'
import {Card, CardActions, CardText, CardMedia, CardTitle} from 'material-ui/lib/card';
import $ from 'jquery';
import RaisedButton from 'material-ui/lib/raised-button';

class Recipe extends React.Component {

  constructor(props) {
    super(props);
    this.style = {
      // width: "25%",
      textAlign: "center",
      width: "450px",
      height: "520px"
    }
    //This is an array of objects we get from the server
    //id ,name, ingredients, directions, cookingtime, region, cost
    //TODO: pass this down via the props
    // this.getRecipes();
    this.state = {
      recipes: []
    }
  }

  componentWillMount() {
    this.getRecipes = () => {
      $.get('http://api.yummly.com/v1/api/recipes?_app_id=99092447&_app_key=3059252f9c071f0adaea0a1d4c6e79a5&q=bacon&requirePictures=true')
      .done((result) => {
        console.log('api results', result.matches);
        let r = [];
        r = result.matches.map((currElement)=>{
          let obj = {};
          obj.id = currElement.id;
          obj.name = currElement.recipeName;
          obj.img = currElement.imageUrlsBySize['90'].replace('s90-c', 's300-c');
          obj.ingredients = currElement.ingredients;
          obj.cookingtime = currElement.totalTimeInSeconds;
          obj.rating = currElement.rating
          return obj;
        });
        console.log('recipes choose', r);
        this.setState({recipes: r});
      });
    }
    this.getRecipes();
  }


  //TODO: Next and yes need to be different.
  next() {
    this.refs.ReactSwipe.swipe.next()
  }

  yes () {
    this.refs.ReactSwipe.swipe.next()
  }

  renderCard (element, index) {

    // console.log('in rendercard', element, index)
    return (
      <div key={index} className="card-container">
        <Card style={this.style}>
        <CardMedia overlay={<CardTitle title={element.name}/>}>
          <img src = {element.img}/>
        </CardMedia>
        <CardActions>
          <RaisedButton label="No" primary={true} onClick={this.next.bind(this)} />
          <RaisedButton label="Yes" secondary={true} onClick={this.next.bind(this)} />
        </CardActions>
        </Card>
      </div>
    )
  }



  render() {
    const recipes = this.state.recipes;
    console.log('recipe choose render', recipes);
    return (
      <div>
        <ReactSwipe
        key={recipes.length}
        ref="ReactSwipe"
        continuous={true}
        speed={800}
        >
          {recipes.map((elem, index) => this.renderCard(elem, index))}
        </ReactSwipe>
        <RaisedButton className="card-container" label="Save and Match!" primary={true} onClick={console.log('do something')} />
      </div>
    )
  }
}

export default Recipe;