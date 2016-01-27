/*
  Header
  <Header/>
*/

import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Catalyst from 'react-catalyst';
import autobind from 'autobind-decorator'
import injectTapEventPlugin from 'react-tap-event-plugin';

@autobind
class FoodDiet extends React.Component {

  constructor(props) {
    super(props);
    this.styles = {
      'display': 'block',
      'text-align': 'center',
      'margin': '5px'
    };
  }

  renderButton(element, index){
    return (
      <RaisedButton style={this.styles} label={element} key={element} primary={true} onClick={this.submitForm.bind(this, element)} />
      )
  }

  renderBudget(element, index) {
    return (
      <MenuItem value={index} key={index} primaryText={this.props.choices.budget[element]} />
    )
  }

  renderPrep(element, index) {
    return (
      <MenuItem value={index} key={index} primaryText={this.props.choices.prep[element]} />
    )
  }

  setBudget(e, index, value) {
    var text = e.target.textContent
    this.props.setBudget({text: text, value: index})
  }

  setPrep(e, index, value) {
    var text = e.target.textContent
    this.props.setPrep({text: text, value: index})
  }

  submitForm(element)   {
    this.props.profSubmit({chosenType: element})
  }

  render() {
    injectTapEventPlugin();
    const choiceButton = Object.keys(this.props.choices.type)
    const budgets = Object.keys(this.props.choices.budget)
    const prep = Object.keys(this.props.choices.prep)

    return (
    <div className="profile-container">
      <div className="profile-item">
        <h3 className="roboto">Choose a Budget</h3>
        <DropDownMenu style={this.styles} value={this.props.budget.value} onChange={this.setBudget}>
          {budgets.map(this.renderBudget)}
        </DropDownMenu>
      </div>
      <br/>
      <div className="profile-item">
        <h3 className="roboto">Choose a Prep Time</h3>
        <DropDownMenu style={this.styles} value={this.props.prep.value} onChange={this.setPrep}>
          {prep.map(this.renderPrep)}
        </DropDownMenu>
      </div>
      <br/>
      <div className="profile-item">
        <h3 className="roboto">Choose a Profile</h3>
        {choiceButton.map(this.renderButton)}
      </div>

    </div>
    )
  }
}


export default FoodDiet;
