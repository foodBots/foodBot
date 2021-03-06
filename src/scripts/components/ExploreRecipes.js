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
import Badge from 'material-ui/lib/badge';


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
     width: "100%",
     marginTop: "3%"

    },
    gridList: {
      width: "100%",
      height: "100%",
      overflowY: 'auto',
      marginBottom: 24
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
    <h1 className="myrecipe-explore"><strong>Explore Recipes</strong></h1>
      <GridList
        cellHeight={250}
        cols={4}
        style={this.gridStyles}>      
      {this.props.exploreRecipes.map((tile, index) => (
        <GridTile          
          className="hvr-grow"
          key={index}
          title={tile.name}
          subtitle={<span>by <b>{tile.username}</b></span>}
          actionIcon={<IconButton onTouchTap={this.handleTouchTap.bind(this, tile)}><Comment color="white"/></IconButton>}>
           <Badge
            style = {{position: 'absolute'}}
            badgeContent={"$"+tile.priceestimate}
            primary={true}
            badgeStyle={{top: 12, left: 230, width: '60px', height: '60px', 'fontSize': '20px', 'backgroundColor': '#B2240B'}}
          >
          </Badge>
          <center>
          <img src={tile.image} />
          </center>
        </GridTile>
      ))}
    </GridList>
    </div>        
    )
  }
}

    
          // onTouchTap={this.handleTouchTap.bind(this, tile)}