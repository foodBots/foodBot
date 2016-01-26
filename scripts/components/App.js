/*
  App
*/

import React from 'react';
import Header from './Header';
import FoodDiet from './FoodDiet'
import Recipe from './RecipeSwipe'
import autobind from 'autobind-decorator'
import Recipe from './RecipeChoose'

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
      chosenType: "",

      recipes: [1,2,3,4,5,6,7,8,9,10]
  
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

  render() {
    return (
      <div>
          <Header />

          <Recipe 
            gotRecipes={this.state.recipes}/>
          
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
