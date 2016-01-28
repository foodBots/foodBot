import React from 'react';
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
    this.state = {
      'error': ''
    }
    this.signUp = this.signUp.bind(this);
    this.clearError = this.clearError.bind(this);
  }

  signUp(e) {
    injectTapEventPlugin();
    e.preventDefault();
    const router = this.context.router;
    const user = {
      email: this.refs.email.getValue(),
      password: this.refs.password.getValue()
    }
    this.refs.signupForm.reset();
    //post email and password
    $.post('/foodBot/auth/signup', user)
    .done((result) => {
      console.log('result', result, 'user', user);
      //redirect to landing page
      // console.log('props',this.props);
      // this.setState({user: user});
      user.id = result;
      this.props.history.pushState(user, '/');
    })
    .fail((error) => {
      if(error.status === 400) {
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
    injectTapEventPlugin();
    return (
      <div>
        <Header />
        <div className="signin-container">
          <form className="sign-up" ref="signupForm" onSubmit={this.signUp}>
            <TextField type="text" ref="email" hintText="email" floatingLabelText="Enter email" errorText={this.state.error} onChange={this.clearError}/><br/>
            <TextField type="password" ref="password" hintText="password" floatingLabelText="Enter password" /><br/>
            <RaisedButton style={this.buttonStyles} type="submit" label="Sign Up" />
          </form>
        </div>
      </div>
    )
  }
}

// SignUp.contextTypes = {
//   router: React.propTypes.func.isRequired
// };

export default SignUp;