import React from 'react';
import {RaisedButton, LeftNav, DropDownMenu, MenuItem, Checkbox, TextField} from 'material-ui'
import Catalyst from 'react-catalyst';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Header from './Header'

injectTapEventPlugin();


const styles = {
  block: {
    maxWidth: 250,
  },
  checkbox: {
    marginBottom: '16px'
  }
};

class ProfileMake extends React.Component {

  constructor(props) {
    super(props);
    this.styles = {
      'display': 'block',
      'margin': '5px'
    };
    this.choices = {
      prep: ["Instant","Some prep","Lotta prep"],
      diet: ["None", "Lacto vegetarian", "Ovo vegetarian", "Pescetarian", "Vegan", "Vegetarian"],
      type: ["Foodie", "Diet"],
      allergies: ["Dairy", "Egg", "Gluten", "Peanut", "Seafood"]
    };
    this.allergies = [];
    this.state = {open: false}
  }

  renderChoice(element, index){
    return (
      <RaisedButton style={this.styles} label={element} key={element} primary={true} onClick={(event) => {
        this.props.setAllergies(this.allergies);
        this.props.profSubmit(element);
      }} />
      )
  }

  renderPrep(element, index) {
    return (
      <MenuItem value={index} key={index} primaryText={this.choices.prep[element]} />
    )
  }

  renderDiet(element, index) {
    return (
      <MenuItem value={index} key={index} primaryText={this.choices.diet[element]} />
    )
  }

  //TODO: make sure we can get allergy values from the checkboxes
  handleAllergies(element, index, value) {
    // console.log(element, index, value, "testing")
    if (value) {
      if(this.allergies.indexOf(element) < 0) {
        this.allergies.push(element);
      }
      console.log(this.allergies);
    } else {
      this.allergies.splice(this.allergies.indexOf(element),1);
      console.log(this.allergies);

    }
  }

  renderAllergies(element, index) {
    return (
      <td key={index}><Checkbox ref={element} iconStyle = {{left: "5"}} label={element} style={styles.checkbox} onCheck={this.handleAllergies.bind(this, element)} /></td>
    )
  }

  renderProfUpdateForm() {
    injectTapEventPlugin();
    const choiceButton = this.choices.type
    const diets = Object.keys(this.choices.diet)
    const prep = Object.keys(this.choices.prep)
    const allergies = this.choices.allergies

    return (
    <div>
    <div /*className="profile-container"*/>
      <div className="profile-item">
        <h5 className="roboto">Choose a Diet!</h5>
        <DropDownMenu style={this.styles} value={this.props.diet.value}
            onChange={(event, index, value) => {
              this.props.setDiet({text: event.target.textContent, value: index})
              }
            }>
          {diets.map((dietItem, index) => this.renderDiet(dietItem, index))}
        </DropDownMenu>
      </div>
     <div className="profile-item">
        <h5 className="roboto">Choose a Prep Time!</h5>
        <DropDownMenu style={this.styles} value={this.props.prep.value} onChange={(event, index, value) => this.props.setPrep({value: index, text: event.target.textContent})}>
          {prep.map((prepItem, index) => this.renderPrep(prepItem, index))}
        </DropDownMenu>
      </div>
      <div className="profile-item">
      <h5 className="roboto">Allergies?</h5>
        <table>
        <tbody>
        <tr>
          {allergies.map((allergyItem, index) => this.renderAllergies(allergyItem, index))}
        </tr>
        </tbody>
        </table>
      </div>
      <div className="profile-item">
        <h5 className="roboto">Choose a Profile</h5>
        {choiceButton.map((typeItem, index) => this.renderChoice(typeItem, index))}
      </div>
      </div>
    </div>
    )
  }
  render(){
    return (
      <div>
      <h3>Your Profile</h3>
        {this.renderProfUpdateForm()}
        <RaisedButton
          label="Open LeftNav"
          onTouchTap={this.props.handleToggle}/>
         <LeftNav
          docked={false}
          width={200}
          open={this.props.open}
          onRequestChange={open => this.props.handleToggle}>
          <MenuItem onTouchTap={this.props.handleClose}>Close</MenuItem>
          <MenuItem onTouchTap={this.props.handleClose}>Close</MenuItem>
        </LeftNav>
      </div>

    )
  }
}

export default ProfileMake;
