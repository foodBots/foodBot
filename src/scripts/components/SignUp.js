import React from 'react';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import $ from 'jquery';
// import injectTapEventPlugin from 'react-tap-event-plugin';
import Header from './Header'
import ProfileMake from './ProfileMake'


class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.buttonStyles = {
      'display': 'block'
    }
    this.inputStyles = {
      'width': '350px',
      'textAlign': 'left'
    }
    this.state = {
      error: '',
      prep: {
        value: 0,
        text: ""
      },
      diet: {
        value: 0,
        text: ""
      },
      chosenType: "",
      allergies: [],

      redirect: (text) => {
        console.log("route is", this.state.componentRoute[text])
        this.setState({currentView: text});
      },

      setDiet: (diet) => {
        this.setState({diet:diet})
      },

      setPrep: (prep) => {
        this.setState({prep: prep})
      },

      setAllergies: (allergies) => {
        this.setState({
          allergies: this.state.allergies.concat(allergies)
        });
        // console.log('seting allergies to', this.state.allergies);
      },

      setChosenRecipes: (chosenRecipes) => {
        this.setState({chosenRecipes})
      },

      profSubmit: (chosenType) => {
        const isFoodie = chosenType === "Foodie";
        this.setState({chosenType: isFoodie})

        const user = {
          name: this.refs.name.getValue(),
          email: this.refs.email.getValue(),
          password: this.refs.password.getValue()
        }

        console.log("user posted is", user)

        $.post('/foodBot/auth/signup', user)
        .done((result) => {
          console.log('result', result, 'user', user);
          const returnedId = result.id;
          user.id = result.id;
          const prof = {
            diet: this.state.diet,
            cookingTime: this.state.prep.value +1,
            foodie: isFoodie,
            allergies: this.state.allergies
          }
          $.post('/foodBot/profile/'+ returnedId, prof)
          .done((result) => {
            user.route = 'Swipe Recipes';
            user.diet = this.state.diet;
            user.cookingTime = this.state.prep.value;
            user.foodie = this.state.chosenType === "foodie";
            user.allergies = this.state.allergies
            this.props.history.pushState(user, '/');
          })
          .fail((error) =>{
            console.log('error creating profile');
          })
        })
        .fail((error) => {
          if(error.status === 400) {
            this.setState({error:error.responseText});
          }
        });
      }
    }
  }
  clearError() {

    if (this.state.error.length > 0) {
      this.setState({error:''});
    }
  }
  //<form className="sign-up" ref="signupForm" onSubmit={this.signUp}>
  // <RaisedButton style={this.buttonStyles} type="submit" label="Sign Up!" />
              // choices={this.state.choices}
  render() {
    // injectTapEventPlugin();
    return (
      <div>
        <Header />
        <div className="signin-container">
          <form className="sign-up" ref="signupForm" >
            <TextField className="profile-item" style={this.inputStyles} type="text" ref="name" hintText="name" floatingLabelText="Enter name" onChange={this.clearError.bind(this)}/><br/>
            <TextField className="profile-item" style={this.inputStyles} type="email" ref="email" hintText="email" floatingLabelText="Enter email" errorText={this.state.error} onChange={this.clearError.bind(this)}/><br/>
            <TextField className="profile-item" style={this.inputStyles} type="password" ref="password" hintText="password" floatingLabelText="Enter password" /><br/>
            <ProfileMake
              redirect={this.state.redirect}
              prep={this.state.prep}
              diet={this.state.diet}
              setDiet={this.state.setDiet.bind(this)}
              setPrep={this.state.setPrep.bind(this)}
              setAllergies={this.state.setAllergies.bind(this)}
              profSubmit={this.state.profSubmit.bind(this)}/>
              <br />
          </form>
        </div>
      </div>
    )
  }
}

export default SignUp;