import React from 'react';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import $ from 'jquery';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Header from './Header'
import { Link } from 'react-router'


class SignIn extends React.Component {
  constructor(props) {
    injectTapEventPlugin();

    super(props);
    this.buttonStyles = {
      'display': 'block',
      'textAlign': 'center'
    }
    this.state = {
      'error': ''
    }
    this.signIn = this.signIn.bind(this);
    this.clearError = this.clearError.bind(this);
  }


  signIn(e) {
    // injectTapEventPlugin();
    e.preventDefault();
    let user = {
      email: this.refs.email.getValue(),
      password: this.refs.password.getValue()
    }
    this.refs.signinForm.reset();
    // post email and password
    $.post('/foodBot/auth/signin', user)

    .done((result) => {
      console.log(result, "result is....")
      user = result;
      user.route = 'Swipe Recipes';
      this.props.history.pushState(user, '/');
    })
    .fail((error) => {
      if(error.status === 400) {
        // alert("Sorry. wrong password. You should fix me too")
        this.setState({error:error.responseText});
        // console.log(error.responseText);
        // this.refs.signupForm.reset();
      }
    });
  }

  clearError() {
    // this.setState({error: ''});
    // console.log(this.state);
    if (this.state.error.length > 0) {
      this.setState({error:''});
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="signin-container">
          <form className="sign-in" ref="signinForm" onSubmit={this.signIn}>
            <TextField type="text" ref="email" hintText="email" floatingLabelText="Enter email" errorText={this.state.error} onChange={this.clearError}/><br/>
            <TextField type="password" ref="password" hintText="password" floatingLabelText="Enter password"  /><br/>
            <RaisedButton style={this.buttonStyles} type="submit" label="Sign In" /><br/>
            <Link to='/signup/'>
            <RaisedButton
                style={this.buttonStyles}
                type="submit" label="Register"
                secondary={true} linkButton={true}
                onClick={(event) => console.log(event.target.textContent)}
                />
              </Link>
              <br />
              <RaisedButton style={this.buttonStyles} linkButton="true" href="http://localhost:3000/auth/google" label="Sign In with Google" />
          </form>
        </div>
      </div>
    )
  }
}

export default SignIn;