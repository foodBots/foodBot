/*
  Header
  <Header/>
*/

import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';

import injectTapEventPlugin from 'react-tap-event-plugin';
class FoodDiet extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      budget: 1,
      time: 1,
      diet: "",
      value: 1
    };
  }

  handleChangeB = (e, index, value) => { 
    event.preventDefault();
    this.setState({budget: value})
  };
  
  handleChangeT = (e, index, value) => { 
    event.preventDefault();
    this.setState({time: value})
  };

  handleClickD = (e, index, value) => {
    event.preventDefault();
    this.setState({diet: "Diet"})

  }

  handleClickF = (e, index, value) => {
    event.preventDefault();
    this.setState({diet: "Foodie"})

  }

  handleClick = () => {console.log("clicked")}
  
  render() {
    injectTapEventPlugin();
    return (    
    <div>
      <h2>Choose a Profile</h2>
      <RaisedButton label="Diet" primary={true} onClick={this.handleClickD} />
        
        <DropDownMenu value={this.state.budget} onChange={this.handleChangeB}>
          <MenuItem value={1} primaryText="$"/>
          <MenuItem value={2} primaryText="$$"/>
          <MenuItem value={3} primaryText="$$$"/>
        </DropDownMenu>

        <DropDownMenu value={this.state.time} onChange={this.handleChangeT}>
          <MenuItem value={1} primaryText="20 min"/>
          <MenuItem value={2} primaryText="1 hour"/>
          <MenuItem value={3} primaryText="Super Prep"/>
        </DropDownMenu>
      <RaisedButton label="Food" primary={true} onClick={this.handleClickF} />        

    </div>
    )
  }
}


export default FoodDiet;
