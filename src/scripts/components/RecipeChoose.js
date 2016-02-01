import React from 'react';
import ReactSwipe from 'react-swipe'
import Header from './Header.js'
import {Card, CardActions, CardText, CardMedia, CardTitle} from 'material-ui/lib/card';
import $ from 'jquery';
import RaisedButton from 'material-ui/lib/raised-button';
import Modal from 'react-modal'

import TestSlider from './RecipeSlider'

class Recipe extends React.Component {

  // getInitialState() {
  //   // return {
  //   //   modalIsOpen: false
  //   // }
  // }
  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  handleModalCloseRequest() {
    // opportunity to validate something and keep the modal open even if it
    // requested to be closed
    this.setState({modalIsOpen: false});
  }

  renderModal() {
    return (
      <Modal
          className="Modal__Bootstrap modal-dialog"
          closeTimeoutMS={150}
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.handleModalCloseRequest}
          >
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={this.handleModalCloseRequest}>
                <span aria-hidden="true">&times;</span>
                <span className="sr-only">Close</span>
              </button>
              <h4 className="modal-title">Modal title</h4>
            </div>
            <div className="modal-body">
              <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={this.handleModalCloseRequest}>Close</button>
              <button type="button" className="btn btn-primary" onClick={this.handleSaveClicked}>Save changes</button>
            </div>
          </div>
        </Modal>
    )
  }

  constructor(props) {
    super(props);
    this.style = {
      textAlign: 'center',
      width: '380px',
      height: '560px'
    }
    this.buttonStyles = {
      display: 'block',
      textAlign: 'center',
      width: '450px'
    }
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
      console.log("GETTING RECIPE IN CLIEN:", this.props);
      $.get('/foodBot/recipes/' + this.props.id.id)
      .done((result) => {
        console.log('api results', result.recipes);
        let r = [];
        r = result.recipes.map((currElement)=>{
          let obj = {};
          obj.id = currElement.id;
          obj.name = currElement.name;
          obj.img = currElement.image.replace('s90', 's300-c');
          obj.ingredients = currElement.ingredients;
          obj.cookingtime = currElement.cookingtime;
          // obj.rating = currElement.rating
          return obj;
        });
        // console.log('recipes choose', r);
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
    console.log('Your match is', this.props.userMatch)
    this.openModal();

    console.log(this.recipesObj);
    this.props.setChosenRecipes(this.recipesObj.liked);
    $.post('/foodBot/meals/' + this.props.id.id, this.recipesObj)
    .done((result) => {
      console.log('posted!')
      //redirect to main view

    })
  }

  renderCard (element, index) {

    // console.log('in rendercard', element, index)
    return (
      <div key={index} className="card-container">
        {this.renderModal()}
        <Card style={this.style}>
        <CardMedia overlay={<CardTitle title={element.name}/>}>
          <img src = {element.img}/>
        </CardMedia>
        <CardActions>
          <RaisedButton label="No" primary={true} onClick={this.next.bind(this, element)} />
          <RaisedButton label="Yes" secondary={true} onClick={this.yes.bind(this, element)} /><br/><br/>
          <RaisedButton  label="Pair and Cook!" primary={true} onClick={this.saveMatch.bind(this)} />
        </CardActions>
        </Card>
      </div>
    )
  }

  render() {
    const recipes = this.state.recipes;
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