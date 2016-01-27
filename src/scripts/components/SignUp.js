import React from 'react';
import autobind from 'autobind-decorator';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import $ from 'jquery';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Header from './Header'

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.buttonStyles = {
      'display': 'block'
    }
  }

  signUp(e) {
    injectTapEventPlugin();
    e.preventDefault();
    const user = {
      username: this.refs.username.getValue(),
      password: this.refs.password.getValue()
    }
    this.refs.signupForm.reset();
    //post username and password
    $.post('/api/signup',this.user).done((result) => {
      console.log('user', this.user);
      //redirect to landing page

    });
  }

  render() {
    injectTapEventPlugin();
    return (
      <div>
        <Header />
        <div className="signin-container">
          <form className="sign-up" ref="signupForm" onSubmit={this.signUp}>
            <TextField type="text" ref="username" hintText="username" floatingLabelText="Enter username" /><br/>
            <TextField type="password" ref="password" hintText="password" floatingLabelText="Enter password" /><br/>
            <RaisedButton style={this.buttonStyles} type="submit" label="Sign Up" />
          </form>
        </div>
      </div>
    )
  }
}

export default SignUp;