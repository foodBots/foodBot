import React from 'react';
import ReactSwipe from 'react-swipe'
import Header from './Header.js'
import {Card, CardActions, CardText, CardMedia, CardTitle} from 'material-ui/lib/card';
import $ from 'jquery';
import RaisedButton from 'material-ui/lib/raised-button';
import { Modal, Button } from 'react-bootstrap';

export default class Recipe extends React.Component {

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
      isModalOpen: false,
      close: () => {
        this.setState({ isModalOpen: false });
        this.props.redirect("View Recipes")
      },
      showModal: () => {
        this.setState({ isModalOpen: true });
      }
    }
  }

  componentWillMount() {
    this.props.getRecipes();
  }

  //takes in recipeId and like bool
  likeOrReject(recipeId, like) {
    // const id = this.props.id
    // console.log(recipeId, like);
    like ? this.props.recipesObj.liked.push(recipeId) : this.props.recipesObj.rejected.push(recipeId);
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

  saveMatch() {        
    this.state.showModal();
    this.props.setChosenRecipes(this.recipesObj.liked);
    $.post('/foodBot/meals/' + this.props.id, this.recipesObj)
      //modify routing for pos
      .done((result) => {      
        console.log("posted!", result)
    })
  }

  renderCard (element, index) {
    return (
      <div key={index} className="card-container">
        <Card style={this.style}>
        <CardMedia overlay={<CardTitle title={element.name}/>}>
          <img src = {element.img}/>
        </CardMedia>
        <CardActions>
          <RaisedButton label="No" primary={true} onClick={this.next.bind(this, element)} />
          <RaisedButton label="Yes" secondary={true} onClick={this.yes.bind(this, element)} /><br/><br/>
        </CardActions>
        </Card>        
      </div>
    )
  }

  render() {
    const recipes = this.props.recipes;
    return (
      <div>
        <div>
        <ReactSwipe
          key={recipes.length}
          ref="ReactSwipe"
          continuous={true}
          speed={800}
        >
          {recipes.map((elem, index) => this.renderCard(elem, index))}
        </ReactSwipe>
        <Modal 
            show={this.state.isModalOpen} 
            onHide={this.state.close}
            container={this}
            bsSize="large">
          <Modal.Header closeButton>Test
          </Modal.Header>
          <Modal.Body>
            <Subtotal />

          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
          </Modal>                                   
        </div>
      </div>
    )
  }
}