import React from 'react';
import autobind from 'autobind-decorator';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import $ from 'jquery';

@autobind
class SignUp extends React.Component {
  signUp(e) {
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
    return (
      <form className="sign-up" ref="signupForm" onSubmit={this.signUp}>
        <TextField type="text" ref="username" hintText="username" floatingLabelText="Enter username" /><br/>
        <TextField type="password" ref="password" hintText="password" floatingLabelText="Enter password" /><br/>
        <RaisedButton type="submit" label="Sign Up" />
      </form>
    )
  }
}

export default SignUp;