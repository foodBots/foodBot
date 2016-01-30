import './css/styles.css'
import './css/bootstrap.min.css'


import React from 'react';
import { render }  from 'react-dom';
import { Router, Route } from 'react-router';
import { createHistory } from 'history';

//import API search

import App from './scripts/components/App';
import SignIn from './scripts/components/SignIn';
import SignUp from './scripts/components/SignUp';
import NotFound from './scripts/components/NotFound';

import Header from './scripts/components/Header.js'
import ProfileMake from './scripts/components/ProfileMake'
import RecipeChoose from './scripts/components/RecipeChoose'
import RecipeView from './scripts/components/RecipeView'
import PairChatRoom from './scripts/components/PairChatRoom'

//incl API key


const routes = (
  <Router history={createHistory()}>
    <Route path="/" component={App}/>
    <Route path="/makeprofile" component={ProfileMake}/>
    <Route path="/recipechoose" component={RecipeChoose}/>
    <Route path="/recipeview" component={PairChatRoom}/>
    <Route path="/signin" component={SignIn}/>
    <Route path="/signout" component={SignIn}/>
    <Route path="/signup" component={SignUp}/>
    <Route path="*" component={NotFound}/>
  </Router>
)

render(routes, document.getElementById('root'));
