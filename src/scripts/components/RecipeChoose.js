import React from 'react';
import ReactSwipe from 'react-swipe'
import Header from './Header.js'
import {Card, CardHeader, CardActions, CardText, CardMedia, CardTitle} from 'material-ui/lib/card';
import $ from 'jquery';
import RaisedButton from 'material-ui/lib/raised-button';
import Badge from 'material-ui/lib/badge';
import Delete from 'material-ui/lib/svg-icons/action/delete';
import Kitchen from 'material-ui/lib/svg-icons/places/kitchen';
import LocalDining from 'material-ui/lib/svg-icons/maps/local-dining';
import IconButton from 'material-ui/lib/icon-button';
import Snackbar from 'material-ui/lib/snackbar';



import firebase from 'firebase'
let newFire = new firebase('https://dazzling-inferno-511.firebaseio.com/')

export default class Recipe extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false
    }

    this.style = {
      textAlign: 'center',
      height: '100vh',
      maxWidth: '350px',
      maxHeight: '600px',
      // minHeight: '300px',
      minWidth: '300px',
      overflow: 'hidden',
      'marginTop': '20px'
    }
    this.buttonStyles = {
      width: '40px',
      height: '50px'
    }
    this.buttonBackgroundStyle = {
      width: '100px'
    }
  }

  componentWillMount() {
    this.props.getRecipes();
  }


  handleRequestClose() {
    this.setState({
      open: false,
    });
  };

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
    this.setState({
      open: true,
    })
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
          <Badge
            style = {{position: 'absolute'}}
            badgeContent={"$" + element.price}
            primary={true}
            badgeStyle={{top: 12, right: 12, width: '70px', height: '70px', 'fontSize': '20px', 'backgroundColor': '#B2240B'}}
          >
          </Badge>
          <img style={{"maxWidth": "350px", "maxHeight": "390px ", "minHeight": "300px","minWidth":"300px", overflow: "hidden"}} src ={element.image}/>
        </CardMedia>
        <CardActions>
          <IconButton style = {this.buttonBackgroundStyle} iconStyle={this.buttonStyles} onTouchTap={this.next.bind(this, element)}><Delete color="#626569"/></IconButton>
          <IconButton style = {this.buttonBackgroundStyle} iconStyle={this.buttonStyles} onTouchTap={this.yes.bind(this, element)}><Kitchen color="#4B78CB"/></IconButton>
          <IconButton style = {this.buttonBackgroundStyle} iconStyle={this.buttonStyles} onTouchTap={this.addToCart.bind(this, element)}><LocalDining color="#B2240B"/></IconButton>
        </CardActions>
        <CardHeader
           style={{padding: "0px", height: "10px"}}
           subtitle="Ingredients"/>
        <CardText style={{overflow: "auto", maxHeight:"150px"}} >
        <table style={{width: "100%"}}>
            {element.ingredients.map((item, i) => {
              return (
                <tr>
                <td style={{float: "left"}}>{item.description.substring(0,40)}</td>
                <td style={{float: "right "}}>${item.price}</td>
                </tr>
                )
              })
            }
            <tr><a href={element.directionsurl} target="_blank">Directions</a></tr>
        </table>
        </CardText>
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
        <Snackbar
          open={this.state.open}
          message= {"Item added to favorites"}
          autoHideDuration={400}
          onRequestClose={this.handleRequestClose.bind(this)}/>
      </div>
    )
  }
}