import React from 'react'
import Header from './Header'
import PairMatch from './PairMatch'
import ReactDOM from 'react-dom';
import $ from 'jquery';

import { GridList, GridTile } from 'material-ui/lib/grid-list';
import StarBorder from 'material-ui/lib/svg-icons/toggle/star-border';
import Comment from 'material-ui/lib/svg-icons/communication/comment';
import IconButton from 'material-ui/lib/icon-button';
import Snackbar from 'material-ui/lib/snackbar';


import { Modal, Button } from 'react-bootstrap';
import RaisedButton from 'material-ui/lib/raised-button';

export default class RecipeLanding extends React.Component {

  componentWillMount() {
    this.props.getExploreRecipes(this.props.id)
   }

  constructor(props) {
  super(props);
   
   this.gridStyles = {
    root: {
     width: "100%"

    },
    gridList: {
      width: "100%",
      height: "100%",
      overflowY: 'auto',
      marginBottom: 24,
    }
  }
}

  handleTouchTap(element) {    
    this.props.openSocialModal(element);
  }

  handleAction(element) {
    event.preventDefault();
    console.log("hello")
  }

  render() {    
    return (
    <div className="myrecipe-container" style={this.gridStyles.root}>
    <h1>Explore Recipes</h1>
      <GridList
        cellHeight={250}
        style={this.gridStyles}>      
      {this.props.exploreRecipes.map((tile, index) => (
        <GridTile          
          key={index}
          title={tile.name}
          subtitle={<span>by <b>{tile.rating}</b></span>}
          actionIcon={<IconButton onTouchTap={this.handleTouchTap.bind(this, tile)}><Comment color="white"/></IconButton>}>
          <img src={tile.image} />
        </GridTile>
      ))}
    </GridList>
    </div>        
    )
  }
}

    
          // onTouchTap={this.handleTouchTap.bind(this, tile)}