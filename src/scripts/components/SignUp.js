import React from 'react';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import $ from 'jquery';
import injectTapEventPlugin from 'react-tap-event-plugin';
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
      choices: {
        prep: ["Instant","Some prep","Lotta prep"],
        diet: ["None", "Lacto vegetarian", "Ovo vegetarian", "Pescetarian", "Vegan", "Vegetarian"],
        type: ["Foodie", "Diet"],
        allergies: ["Dairy", "Egg", "Gluten", "Peanut", "Seafood"]
      },

      prep: {
        value: 0,
        text: ""
      },

      diet: {
        value: 0,
        text: ""
      },
      redirect: (text) => {
        console.log("route is", this.state.componentRoute[text])
        this.setState({currentView: text});
      },

      setDiet: (diet) => {
        this.setState({diet})
      },

      setPrep: (prep) => {
        this.setState({prep})
      },

      setChosenRecipes: (chosenRecipes) => {
        this.setState({chosenRecipes})
      },

      profSubmit: (chosenType) => {
        console.log('chosentType', chosenType)
        this.setState({chosenType})
        console.log(this.props.location.state)
        // const id = this.props.location.state.id.id
        // console.log('ID POST PROPS:', id);
        const prof = {
          diet: this.state.diet,
          cookingTime: this.state.prep.value,
          foodie: this.state.chosenType === "foodie"
        }
        const user = {
          email: this.refs.email.getValue(),
          password: this.refs.password.getValue()
        }
        $.post('/foodBot/auth/signup', user)
        .done((result) => {
          console.log('result', result, 'user', user);
          //redirect to landing page
          // console.log('props',this.props);
          // this.setState({user: user});
          user.id = result.id;
          $.post('/foodBot/profile/'+ user.id, prof)
          .done((result) => {
            // this.state.redirect("Swipe Recipes")
            user.route = 'Swipe Recipes';
            user.diet = this.state.diet;
            user.cookingTime = this.state.prep.value;
            user.foodie = this.state.chosenType === "foodie";
            console.log('result after prorifle post', result, 'user', user);
            this.props.history.pushState(user, '/');
          })
          .fail((error) =>{
            console.log('error updating profile');
          })
        })
        .fail((error) => {
          if(error.status === 400) {
            this.setState({error:error.responseText});
            // console.log(error.responseText);
            // this.refs.signupForm.reset();
          }
        });
      }
    }
    // this.signUp = this.signUp.bind(this);
    // this.clearError = this.clearError.bind(this);
  }

  // signUp(e) {
  //   e.preventDefault();
  //   // const router = this.context.router;
  //   const user = {
  //     email: this.refs.email.getValue(),
  //     password: this.refs.password.getValue()
  //   }
  //   this.refs.signupForm.reset();
  //   //post email and password
  //   $.post('/foodBot/auth/signup', user)
  //   .done((result) => {
  //     console.log('result', result, 'user', user);
  //     //redirect to landing page
  //     // console.log('props',this.props);
  //     // this.setState({user: user});
  //     user.id = result;
  //     user.route= 'Profile Settings';
  //     this.props.history.pushState(user, '/');
  //   })
  //   .fail((error) => {
  //     if(error.status === 400) {
  //       this.setState({error:error.responseText});
  //       // console.log(error.responseText);
  //       // this.refs.signupForm.reset();
  //     }
  //   });
  // }
  clearError() {
    // this.setState({error: ''});
    // console.log(this.state);
    if (this.state.error.length > 0) {
      this.setState({error:''});
    }
  }
  //<form className="sign-up" ref="signupForm" onSubmit={this.signUp}>
  // <RaisedButton style={this.buttonStyles} type="submit" label="Sign Up!" />
  render() {
    injectTapEventPlugin();
    return (
      <div>
        <Header />
        <div className="signin-container">
          <form className="sign-up" ref="signupForm" >
            <TextField className="profile-item" style={this.inputStyles} type="text" ref="email" hintText="email" floatingLabelText="Enter email" errorText={this.state.error} onChange={this.clearError.bind(this)}/><br/>
            <TextField className="profile-item" style={this.inputStyles} type="password" ref="password" hintText="password" floatingLabelText="Enter password" /><br/>
            <ProfileMake
              redirect={this.state.redirect}
              choices={this.state.choices}
              prep={this.state.prep}
              diet={this.state.diet}
              setDiet={this.state.setDiet.bind(this)}
              setPrep={this.state.setPrep.bind(this)}
              profSubmit={this.state.profSubmit.bind(this)}/>
              <br />
          </form>
        </div>
      </div>
    )
  }
}

export default SignUp;