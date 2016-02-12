import React from 'react'
import Header from './Header'
import ReactDOM from 'react-dom';
import $ from 'jquery';

import { GridList, GridTile } from 'material-ui/lib/grid-list';
//import Colors from 'material-ui/lib/styles/colors';
import CameraEnhance from 'material-ui/lib/svg-icons/action/camera-enhance';
import IconButton from 'material-ui/lib/icon-button';
import Comment from 'material-ui/lib/svg-icons/communication/comment';
import LocalGrocery from 'material-ui/lib/svg-icons/maps/local-grocery-store';
import Edit from 'material-ui/lib/svg-icons/editor/mode-edit'
import Star from 'material-ui/lib/svg-icons/toggle/star';
import ActionAndroid from 'material-ui/lib/svg-icons/action/android';
import Avatar from 'material-ui/lib/avatar';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

import RaisedButton from 'material-ui/lib/raised-button';
import PhotoUpload from './PhotoUpload'
import Snackbar from 'material-ui/lib/snackbar';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();



export default class MyRecipes extends React.Component {

  componentWillMount() {
    this.props.getChosenRecipes(this.props.userid);
  }
  
  constructor(props) {
    super(props);
    this.styles = {
      width:"500px",
      "align": "center"
    }
    this.gridStyles = {
      gridList: {
        width: "100%",
        height: "100%",
        overflowY: 'auto',
        marginBottom: 24,
        // display: "inline"
        paddingTop: "10px"
      }
    }

    this.avatar = {
      paddingTop: "3%",
      paddingLeft: "2%"
    }

    this.button = {
      margin: 12
    }

    this.raisedbutton = {
      width: '100%',
      cursor: 'pointer'
    }

    this.state = {
      currRecipeId: 0,
      uploadCount:0,
      open: false
    }

    this.increaseUploadCount = this.increaseUploadCount.bind(this);
  }

  handleTouchTap (element) {
    this.setState({
      open: true,
    });
    console.log(element, "here's the element")
    this.props.orderAgain(element);
  };

  handleRequestClose() {
    this.setState({
      open: false,
    });
  };

  increaseUploadCount() {
    this.setState({uploadCount: this.state.uploadCount+1});
    console.log('increased counter', this.state.uploadCount);
    this.props.getChosenRecipes(this.props.userid);
  }

  handleAction(element) {
    console.log(element.name, element.recipeid)
    this.setState({currRecipeId: element.recipeid});
    $('.dz-default').trigger('click');
    //upload photo
  }

  render() {
    return (
    <div>
      <div className="myprofile-container" >
        <div className="row">
          <div className="avatar col-xs-3 " >
            <Avatar 
              src={this.props.userphoto} 
              size={110}
              style = {this.avatar}
              paddingTop="3%"
              paddingLeft="2%"
            />
          </div>
          <div className="user-info col-xs-6" >
            <div className="user-data row">
              <div className="user-meals col-xs-5" >
                <div className="meals-quant row" >
                  <strong>{this.props.orders}</strong>
                </div>
                <div className="meals-label row" >
                  <span>cooked</span>
                </div>
              </div>
              <div className="user-posts col-xs-5" >
                <div className="posts-quant row" >
                  <strong>{this.props.chosenRecipes.length}</strong>
                </div>
                <div className="posts-label row" >
                  <span>favorites</span>
                </div>
              </div>
            </div>
            <div className="edit-profile row">
              <div className = "user-edit col-xs-10">
                <RaisedButton
                  icon={<Edit />}
                  label="Edit Profile"
                  primary={true}
                  labelPosition="before"
                  style = {this.raisedbutton}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <h3 className="user-dishes">{this.props.username}'s Meals</h3>
    <div className="myrecipe-container">
    <GridList
        cellHeight={250}
        cols={2}
        style={this.gridStyles}
        >
      {this.props.chosenRecipes.map((tile,index) => (        
        <GridTile
          className="hvr-grow"
          key={index}
          title={<IconButton className="tile-icons" onTouchTap={this.handleTouchTap.bind(this, tile)}><LocalGrocery color="white"/></IconButton>}
          subtitle={tile.recipename}
          actionPosition="right"
          actionIcon={<IconButton className="tile-icons" onTouchTap={this.handleAction.bind(this, tile)}><CameraEnhance color="white"/></IconButton>}>
          <img src={tile.userimage || tile.recipeimage}/>       
        </GridTile>
      ))}
    </GridList>
    <PhotoUpload
      userid={this.props.userid}
      recipeid={this.state.currRecipeId}
      increaseUploadCount={this.increaseUploadCount}/>
    <Snackbar
      open={this.state.open}
      message="Item added to cart"
      autoHideDuration={4000}
      onRequestClose={this.handleRequestClose.bind(this)}/>
    </div>
    </div>
    )
  }
}