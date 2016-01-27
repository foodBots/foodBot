import React from 'react';
import { render }  from 'react-dom';
import { Router, Route } from 'react-router';
import { createHistory } from 'history';

//import API search

import App from './scripts/components/App';
import SignIn from './scripts/components/SignIn';
import SignUp from './scripts/components/SignUp';
import NotFound from './scripts/components/NotFound';

//incl API key

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

render(routes, document.getElementById('root'));
