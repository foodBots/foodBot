import React  from 'react';
import ReactDOM  from 'react-dom';
import { Router, Route } from 'react-router';
import { createHistory } from 'history';

import NotFound from './components/NotFound';
import App from './components/App';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';


/*
  Routes
*/

const routes = (
  <Router history={createHistory()}>
    <Route path="/" component={App}/>
    <Route path="/signin" component={SignIn}/>
    <Route path="/signup" component={SignUp}/>
    <Route path="*" component={NotFound}/>
  </Router>
  )


ReactDOM.render(routes, document.querySelector('#main'));
