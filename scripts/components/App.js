/*
  App
*/

import React from 'react';
import Header from './Header';
import FoodDiet from './FoodDiet'
import Recipe from './RecipeSwipe'
import autobind from 'autobind-decorator'

// import Catalyst from 'react-catalyst';
// import reactMixin from 'react-mixin';
// import autobind from 'autobind-decorator';

@autobind
class App extends React.Component {

  constructor() {
    super();

    this.state = {
      choices: {
        prep: {
          0: "Instant",
          1: "Some prep",
          2: "Lotta prep",
          value: 0
        },

        budget: {
          0: "$",
          1: "$$",
          2: "$$$",
          value: 0
        },
        type: {
          foodie: "foodie",
          diet: "diet"
        }
      },

      prep: {
        value: 0,
        text: ""
      },
      budget: {
        value: 0,
        text: ""
      },
      chosenType: ""
    }

  }

  setBudget(budget) {
    this.setState({budget: budget})
  }

  setPrep(prep) {
    this.setState({prep: prep})
  }

  profSubmit(chosenType) {
    this.setState({chosenType: chosenType})
  }

          // <Recipe />

  render() {
    return (
      <div>
          <Header />
          <FoodDiet
                   choices={this.state.choices}
                   prep={this.state.prep}
                   budget={this.state.budget}
                   setBudget={this.setBudget}
                   setPrep={this.setPrep}
                   profSubmit={this.profSubmit} />


      </div>
    )
  }

};

export default App;
