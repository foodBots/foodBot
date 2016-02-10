import React from 'react'
import Header from './Header'
import ReactDOM from 'react-dom';
import $ from 'jquery';

import { GridList, GridTile } from 'material-ui/lib/grid-list';
import CameraEnhance from 'material-ui/lib/svg-icons/action/camera-enhance';
import IconButton from 'material-ui/lib/icon-button';

import { Modal, Button } from 'react-bootstrap';
import RaisedButton from 'material-ui/lib/raised-button';
import PhotoUpload from './PhotoUpload'


export default class MyRecipes extends React.Component {

  componentWillMount() {
    this.props.getChosenRecipes(this.props.userid);
  }
  
  constructor(props) {
    super(props);
    this.styles = {
      width:"400px"
    }
    this.gridStyles = {
      gridList: {
        width: "100%",
        height: "100%",
        overflowY: 'auto',
        marginBottom: 24,
      }
    }
    this.state = {
      currRecipeId: 0,
      uploadCount:0
    }
    this.increaseUploadCount = this.increaseUploadCount.bind(this);
  }

  handleTouchTap(element) {
    console.log("inside MyRecipes", element)
    this.props.openSocialModal(element);
  }

  increaseUploadCount() {
    this.setState({uploadCount: this.state.uploadCount+1});
    console.log('increased counter', this.state.uploadCount);
    this.props.getChosenRecipes(this.props.userid);
  }

  handleAction(element) {
    console.log(element.name, element.recipeid)
    this.setState({currRecipeId: element.recipeid});
    $('.dz-default').trigger('click');
  }

  render() {
    return (
    <div className="myrecipe-container" >
    <GridList
        cellHeight={250}
        cols={2}
        style={this.styles}
        >
      {this.props.chosenRecipes.map((tile,index) => (
        <GridTile
          key={index}
          title={tile.recipename}
          subtitle={<span>by <b>{tile.rating}</b></span>}
          actionIcon={<IconButton onTouchTap={this.handleAction.bind(this, tile)}><CameraEnhance color="white"/></IconButton>}>
          <img src={tile.userimage || tile.recipeimage} />
        </GridTile>
      ))}
    </GridList>
    <PhotoUpload
      userid={this.props.userid}
      recipeid={this.state.currRecipeId}
      increaseUploadCount={this.increaseUploadCount}
      />
    </div>
    )
  }
}

