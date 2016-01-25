/*
  Header
  <Header/>
*/

import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import FontIcon from 'material-ui/lib/font-icon';
import Colors from 'material-ui/lib/styles/colors';
import ActionHome from 'material-ui/lib/svg-icons/action/home';

const iconStyles = {
    marginRight: 30,
  }

export default class Header extends React.Component {

  
  render() {
    return (  
        <div>
          <AppBar
            title="FoodRobot"
            iconElementLeft={<ActionHome style={iconStyles}/>}/>
        </div>
    
    )
  }
}

export default Header;
