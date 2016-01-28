import React from 'react';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import $ from 'jquery';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Header from './Header'


class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.buttonStyles = {
      'display': 'block',
      'textAlign': 'center'
    }
    this.signIn = this.signIn.bind(this);
  }

  signIn(e) {
    injectTapEventPlugin();
    e.preventDefault();
    const user = {
      username: this.refs.username.getValue(),
      password: this.refs.password.getValue()
    }
    this.refs.signinForm.reset();
    //post username and password
    //console.log(user);
    $.post('/foodBot/auth/signin',this.user).done((result) => {
      console.log('user', this.user);
      this.props.history.pushState(user, '/recipechoose')
    });
  }

  render() {
    injectTapEventPlugin();
    return (

      <div>
        <Header />
        <div className="signin-container">
          <form className="sign-in" ref="signinForm" onSubmit={this.signIn}>
            <TextField type="text" ref="username" hintText="username" floatingLabelText="Enter username" /><br/>
            <TextField type="password" ref="password" hintText="password" floatingLabelText="Enter password"  /><br/>
            <RaisedButton style={this.buttonStyles} type="submit" label="Sign In" /><br/>
            <RaisedButton style={this.buttonStyles} type="submit" label="Register" secondary={true} linkButton={true} href="/signup"/>
          </form>
        </div>
      </div>
    )
  }
}

export default SignIn;