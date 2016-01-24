import React from 'react';
import autobind from 'autobind-decorator';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import $ from 'jquery';

@autobind
class SignIn extends React.Component {
  signIn(e) {
    e.preventDefault();
    const user = {
      username: this.refs.username.getValue(),
      password: this.refs.password.getValue()
    }
    this.refs.signinForm.reset();
    //post username and password
    //console.log(user);
    $.post('/api/signin',this.user).done((result) => {
      console.log('user', this.user);
      //redirect to landing page
    });
  }

  render() {
    return (
      <form className="sign-in" ref="signinForm" onSubmit={this.signIn}>
        <TextField type="text" ref="username" hintText="username" floatingLabelText="Enter username" /><br/>
        <TextField type="password" ref="password" hintText="password" floatingLabelText="Enter password"  /><br/>
        <RaisedButton type="submit" label="Sign In" />
        <RaisedButton type="submit" label="Register" secondary={true} linkButton={true} href="/signup"/>
      </form>
    )
  }
}

export default SignIn;