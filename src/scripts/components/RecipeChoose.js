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
      textAlign: 'center',
      width: '450px',
      height: '520px'
    }
    this.buttonStyles = {
      display: 'block',
      textAlign: 'center',
      width: '450px'
    }
    //This is an array of objects we get from the server
    //id ,name, ingredients, directions, cookingtime, region, cost
    //TODO: pass this down via the props
    // this.getRecipes();
    this.state = {
      recipes: []
    }
    this.recipesObj = {
      liked: [],
      rejected: []
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
  //takes in recipeId and like bool
  likeOrReject(recipeId, like) {
    // const id = this.props.id
    console.log(recipeId, like);
    like ? this.recipesObj.liked.push(recipeId) : this.recipesObj.rejected.push(recipeId);
    // console.log('save recipeObj', this.recipesObj);
  }
  next(element) {
    this.likeOrReject(element.id, false);
    this.refs.ReactSwipe.swipe.next()
  }

  yes (element) {
    this.likeOrReject(element.id, true);
    this.refs.ReactSwipe.swipe.next()
  }
  saveMatch() {
    console.log(this.recipesObj);
    // $.post('/foodBot/meals/' + this.props.id.id, this.recipesObj)
    // .done((result) =>{
    //   console.log('posted!')
    //   //redirect to main view
    // })
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
          <RaisedButton label="No" primary={true} onClick={this.next.bind(this, element)} />
          <RaisedButton label="Yes" secondary={true} onClick={this.yes.bind(this, element)} /><br/><br/>
          <RaisedButton  label="Save and Match!" primary={true} onClick={this.saveMatch.bind(this)} />
        </CardActions>
        </Card>

      </div>
    )
  }

  render() {
    const recipes = this.state.recipes;
    console.log('recipe choose render', recipes);
    return (
      <div >
        <div>
        <ReactSwipe
        key={recipes.length}
        ref="ReactSwipe"
        continuous={true}
        speed={800}
        >
          {recipes.map((elem, index) => this.renderCard(elem, index))}
        </ReactSwipe>

        </div>

      </div>
    )
  }
}

export default Recipe;