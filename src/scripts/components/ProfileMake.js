import React from 'react';
import {RaisedButton, DropDownMenu, MenuItem, Checkbox} from 'material-ui'
import Catalyst from 'react-catalyst';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Header from './Header'

const styles = {
  block: {
    maxWidth: 250,
  },
  checkbox: {
    marginBottom: 16
  },
};

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
      <RaisedButton style={this.styles} label={element} key={element} primary={true} onClick={(event) => this.props.profSubmit(element)} />
      )
  }

  renderDiet(element, index) {
    return (
      <MenuItem value={index} key={index} primaryText={this.props.choices.diet[element]} />
    )
  }

  handleCheck(element, index, value) {
    console.log(element, index, value, "testing")
  }

  renderAllergies(element, index) {
    injectTapEventPlugin();
    return (
      <td key={index}><Checkbox ref={element} label={element} style={styles.checkbox} onCheck={this.handleCheck} /></td>          
    )
  }

  renderPrep(element, index) {
    return (
      <MenuItem value={index} key={index} primaryText={this.props.choices.prep[element]} />
    )
  }

  render() {
    injectTapEventPlugin();
    const choiceButton = this.props.choices.type
    const diets = Object.keys(this.props.choices.diet)
    const prep = Object.keys(this.props.choices.prep)
    const allergies = this.props.choices.allergies

    return (
    <div>
    <div className="profile-container">
      <div className="profile-item">
        <h3 className="roboto">Choose a Diet!</h3>
        <DropDownMenu style={this.styles} value={this.props.diet.value}
            onChange={(event, index, value) => this.props.setDiet({value: index, text: event.target.textContent})}>
          {diets.map((dietItem, index) => this.renderDiet(dietItem, index))}
        </DropDownMenu>
      </div>
     <div className="profile-item">
        <h3 className="roboto">Choose a Prep Time!</h3>
        <DropDownMenu style={this.styles} value={this.props.prep.value} onChange={(event, index, value) => this.props.setPrep({value: index, text: event.target.textContent})}>
          {prep.map((prepItem, index) => this.renderPrep(prepItem, index))}
        </DropDownMenu>
      </div>
      <div className="profile-item">
      <h3 className="roboto">Allergies?</h3>
        <table>
        <tbody>
        <tr>
          {allergies.map((allergyItem, index) => this.renderAllergies(allergyItem, index))}          
        </tr>
        </tbody>
        </table>
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
