import React from 'react'
import Header from './Header'
import PairMatch from './PairMatch'
import ReactDOM from 'react-dom';
import $ from 'jquery';

import { GridList, GridTile } from 'material-ui/lib/grid-list';
import StarBorder from 'material-ui/lib/svg-icons/toggle/star-border';
import IconButton from 'material-ui/lib/icon-button';

import { Modal, Button } from 'react-bootstrap';
import RaisedButton from 'material-ui/lib/raised-button';

export default class RecipeLanding extends React.Component {

  componentWillMount() {
    this.props.getExploreRecipes(this.props.id)
   }

  constructor() {
  super();
   
   this.gridStyles = {
    // root: {
    //   display: 'flex',
    //   flexWrap: 'wrap',
    //   justifyContent: 'space-around',
    // },
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
  }

  render() {    
    return (
    <div>
    <h1>Explore Recipes</h1>
      <GridList
        cellHeight={250}
        style={this.gridStyles}>      
      {this.props.exploreRecipes.map((tile, index) => (
        <GridTile
          key={index}
          title={tile.name}
          subtitle={<span>by <b>{tile.rating}</b></span>}
          onTouchTap={this.handleTouchTap.bind(this, tile)}
          actionIcon={<IconButton onTouchTap={this.handleAction.bind(this, tile)}><StarBorder color="white"/></IconButton>}>
          <img src={tile.image} />
        </GridTile>
      ))}
    </GridList>
    </div>        
    )
  }
}

    