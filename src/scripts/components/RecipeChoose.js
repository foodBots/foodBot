import React from 'react';
import ReactSwipe from 'react-swipe'
import Header from './Header.js'
import {Card, CardActions, CardText, CardMedia, CardTitle} from 'material-ui/lib/card';
import $ from 'jquery';
import RaisedButton from 'material-ui/lib/raised-button';


import firebase from 'firebase'
let newFire = new firebase('https://dazzling-inferno-511.firebaseio.com/')

export default class Recipe extends React.Component {

  constructor(props) {
    super(props);
    this.style = {
      textAlign: 'center',
      height: '100vh'
    }
    this.buttonStyles = {
      display: 'block',
      textAlign: 'center',
      width: '450px'
    }
  }

  componentWillMount() {
    this.props.getRecipes();
  }

  likeOrReject(recipeId, like) {

    // const id = this.props.id
    // only add once to rejected or liked arrays
    if (like) {
      if (this.props.recipesObj.liked.indexOf(recipeId) < 0) {
        this.props.recipesObj.liked.push(recipeId);
      }
    } else {
      if (this.props.recipesObj.rejected.indexOf(recipeId) < 0) {
        this.props.recipesObj.rejected.push(recipeId);
      }
    }
    console.log('saved recipeObj', this.props.recipesObj);
  }

  next(element) {
    this.likeOrReject(element.id, false);    
    this.refs.ReactSwipe.swipe.next()
  }

  yes (element) {
    this.likeOrReject(element.id, true);
    this.refs.ReactSwipe.swipe.next()
  }

  addToCart (element) {
    this.likeOrReject(element.id, true);        
    this.props.showModal(element)
    this.refs.ReactSwipe.swipe.next()
  }

  renderCard (element, index){
    return (
      <div key={index} className="card-container">
        <Card style={this.style}>
        <CardMedia overlay={<CardTitle title={element.name}/>}>
          <img style={{"max-width": "100%", "max-height": "100%", overflow: "hidden"}} src ={element.image}/>
        </CardMedia>
        <CardText>
        <h4>Estimated Cost</h4>
          <strong>${element.price}</strong>
        </CardText>
        <CardActions>
          <RaisedButton label="No" primary={true} onClick={this.next.bind(this, element)} />
          <RaisedButton label="Save for Later" primary={true} onClick={this.yes.bind(this, element)} />
          <RaisedButton label="Add to Cart" secondary={true} onClick={this.addToCart.bind(this, element)} />
        </CardActions>
        <h3>Ingredients</h3>
        <ul>
          {element.ingredients.map((item, i) => {
            return <li>{item.description}: {item.price}</li>
            })
          }          
        </ul>
        </Card>
      </div>
    )
  }

  render() {
    return (
      <div>
        <ReactSwipe key={this.props.recipes.length} ref="ReactSwipe" continuous={true} speed={800}>
          {this.props.recipes.map((elem, index) => this.renderCard(elem, index))}
        </ReactSwipe>
      </div>
    )
  }
}