import React from 'react';
import {RaisedButton, DropDownMenu, MenuItem} from 'material-ui'
import Catalyst from 'react-catalyst';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Header from './Header'


class ProfileMake extends React.Component {

  constructor(props) {
    super(props);
    this.styles = {
      'display': 'block',
      'textAlign': 'center',
      'margin': '5px'
    };
  }

  renderChoice(element, index){
    return (
      <RaisedButton style={this.styles} label={element} key={element} primary={true} onClick={(event) => this.props.location.state.profSubmit(element)} />
      )
  }

  renderBudget(element, index) {
    return (
      <MenuItem value={index} key={index} primaryText={this.props.location.state.choices.budget[element]} />
    )
  }

  renderPrep(element, index) {
    return (
      <MenuItem value={index} key={index} primaryText={this.props.location.state.choices.prep[element]} />
    )
  }

  submitForm(element)   {
    console.log(element)
    this.props.location.state.profSubmit({chosenType: element})
  }

  render() {
    injectTapEventPlugin();
    const choiceButton = this.props.location.state.choices.type
    const budgets = Object.keys(this.props.location.state.choices.budget)
    const prep = Object.keys(this.props.location.state.choices.prep)

    return (
    <div>
    <Header redirect={this.props.location.state.redirect}/>
    <div className="profile-container">
      <div className="profile-item">
        <h3 className="roboto">Choose a Budget</h3>
        <DropDownMenu style={this.styles} value={this.props.location.state.budget.value} 
            onChange={(event, index, value) => this.props.location.state.setBudget({value: index, text: event.target.textContent})}>
          {budgets.map((budgetItem, index) => this.renderBudget(budgetItem, index))}
        </DropDownMenu>
      </div>
      <br/>
     <div className="profile-item">
        <h3 className="roboto">Choose a Prep Time</h3>
        <DropDownMenu style={this.styles} value={this.props.location.state.prep.value} onChange={(event, index, value) => this.props.location.state.setPrep({value: index, text: event.target.textContent})}>
          {prep.map((prepItem, index) => this.renderPrep(prepItem, index))}
        </DropDownMenu>
      </div>
      <div className="profile-item">
        <h3 className="roboto">Choose a Profile</h3>
        {choiceButton.map((typeItem, index) => this.renderChoice(typeItem, index))}
      </div>     
      </div>
    </div>
    )
  }
}

export default ProfileMake;
