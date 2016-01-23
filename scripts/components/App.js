/*
  App
*/

import React from 'react';

import Header from './Header';
import FoodDiet from './FoodDiet'

import Catalyst from 'react-catalyst';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';

// Firebase

class App extends React.Component {
  
  constructor() {
    super();

    this.state = {
      diet : {},
      time : {},
      meals : {},
      budget : {}
    }
  }

  render() {
    return (
      <div>        
          <Header />
          <FoodDiet />
                    
      </div>
    )
  }

};

export default App;
