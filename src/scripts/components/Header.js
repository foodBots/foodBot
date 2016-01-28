/*
  Header
  <Header/>
*/

import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';


//This should be destructured
import AppBar from 'material-ui/lib/app-bar';
import FontIcon from 'material-ui/lib/font-icon';
import Colors from 'material-ui/lib/styles/colors';
import ActionHome from 'material-ui/lib/svg-icons/action/home';
import FlatButton from 'material-ui/lib/flat-button';


//NavBar
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/lib/menus/menu-item';
import { Router, Route, Link } from 'react-router'

const iconStyles = {
    marginRight: 30,
  }

export default class Header extends React.Component {

  render() {
    injectTapEventPlugin();
    return (
          <div>
          <AppBar
            title="FoodRobot"
            iconElementLeft={<ActionHome style={iconStyles}/>}
            iconElementRight={
          <FlatButton label="Profile" linkButton={true} href="/makeprofile"/>
          /*<IconMenu
            iconButtonElement={
          <IconButton><MoreVertIcon /></IconButton>
             }
           targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem primaryText="Profile Settings" onClick={(event) => this.props.redirect(event.target.textContent)}/>
        <MenuItem primaryText="Swipe Recipes" onClick={(event) => this.props.redirect(event.target.textContent)}/>
        <MenuItem primaryText="View Recipes" onClick={(event) => this.props.redirect(event.target.textContent)}/>
        <MenuItem primaryText="Sign out" onClick={(event) => this.props.redirect(event.target.textContent)} />
        <Link to="/makeprofile"><MenuItem primaryText="test"/></Link>
      </IconMenu>*/}/>
      </div>

    )
  }
}

export default Header;
