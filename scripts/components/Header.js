/*
  Header
  <Header/>
*/

import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import FontIcon from 'material-ui/lib/font-icon';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
  }


 

  render() {
    const iconStyles = {
      marginRight: 24,
    };

    return (  
        <AppBar
          title="FoodRobot"
          iconElementLeft={
            <FontIcon className="muidocs-icon-action-home"
            style={iconStyles} />}
          />
    
    )
  }
}

export default Header;
