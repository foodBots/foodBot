/*
  Header
  <Header/>
*/

import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import FontIcon from 'material-ui/lib/font-icon';
import Colors from 'material-ui/lib/styles/colors';
import ActionHome from 'material-ui/lib/svg-icons/action/home';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/lib/menus/menu-item';

const iconStyles = {
  marginRight: 30,
}

export default class Header extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    if(this.props.loggedIn) {
      return (
          <div>
            <AppBar
              title="FoodRobot"
              iconElementLeft={<ActionHome style={iconStyles}/>}
              iconElementRight={
                <IconMenu
                  iconButtonElement={
                    <IconButton><MoreVertIcon /></IconButton>
                  }
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                  >
                    <MenuItem primaryText="Find Recipes" />
                    <MenuItem primaryText="My Recipes" />
                    <MenuItem primaryText="Matches" />
                    <MenuItem primaryText="Profile" />
                    <MenuItem primaryText="Sign out" />
                </IconMenu>
              }/>
          </div>
      )
    } else {
      return (
        <AppBar
          title="FoodRobot"
          iconElementLeft={<ActionHome style={iconStyles}/>} />
      )
    }
  }
}

export default Header;
