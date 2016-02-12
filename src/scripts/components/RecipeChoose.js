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



import firebase from 'firebase'
let newFire = new firebase('https://dazzling-inferno-511.firebaseio.com/')

export default class Recipe extends React.Component {

  constructor(props) {
    super(props);
    this.style = {
      textAlign: 'center',
      'margin-top': '20px',
      height: '100vh',
      maxWidth: '350px',
      maxHeight: '600px',
      // minHeight: '300px',
      minWidth: '300px',
      overflow: 'hidden'
    }
    this.buttonStyles = {
      width: '48px', 
      height: '40px'
    }
    this.buttonBackgroundStyle = {
      width: '100px'
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
           <Badge
             style = {{position: 'absolute'}}
             badgeContent={"$" + element.price}
             primary={true}
             badgeStyle={{top: 12, right: 12, width: '70px', height: '70px', 'fontSize': '30px', opacity: '0.8'}}
           >
           </Badge>
           <img style={{"max-width": "350px", "max-height": "390px ", "min-height": "300px","min-width":"300px", overflow: "hidden"}} src ={element.image}/>
         </CardMedia>
         <CardActions>
           <IconButton style = {this.buttonBackgroundStyle}  iconStyle={this.buttonStyles} onTouchTap={this.next.bind(this, element)}><Delete  color="#1DB272"/></IconButton>
           <IconButton style = {this.buttonBackgroundStyle}  iconStyle={this.buttonStyles} onTouchTap={this.yes.bind(this, element)}><Kitchen color="#335CFF"/></IconButton>
           <IconButton style = {this.buttonBackgroundStyle} iconStyle={this.buttonStyles} onTouchTap={this.addToCart.bind(this, element)}><LocalDining color="#B2240B"/></IconButton>
         </CardActions>
         <CardHeader
           style={{padding: "0px", height: "15px"}}
           subtitle="Ingredients"/>
        <CardText style={{overflow: "hidden"}}>
        <table style={{width: "100%"}}>          
            {element.ingredients.map((item, i) => {
              return (
                <tr>
                <td style={{float: "left"}}>{item.description}</td>
                <td style={{float: "right"}}>${item.price}</td>
                </tr>
                )
              })
            }          
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
      </div>
    )
  }
}