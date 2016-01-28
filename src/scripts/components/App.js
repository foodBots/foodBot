import React from 'react';
import Header from './Header.js'
import ProfileMake from './ProfileMake'
import Recipe from './RecipeChoose'
import RecipeView from './RecipeView'
import SignIn from './SignIn'
import PairChatRoom from './PairChatRoom'


class App extends React.Component {

  constructor() {
    super();

    this.state = {
      choices: {
        prep: ["Instant","Some prep","Lotta prep"],
        budget: ["$","$$", "$$$"],
        type: ["foodie", "diet"]
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

      //Recipes from GET request go here
      recipes: [1,2,3,4,5,6,7,8,9,10],
      messages: [],
  
      componentRoute: {
        "Profile Settings": "makeprofile",
        "Swipe Recipes": "recipechoose",
        "View Recipes": "recipeview",
        "Sign out": "signout"
      },
    
      redirect: (text) => {
        console.log("route is", this.state.componentRoute[text])
        this.props.history.pushState(this.state, "/" + this.state.componentRoute[text])
      },
    
      setBudget: (budget) => {
        this.setState({budget})
      },

      setPrep: (prep) => {
        this.setState({prep})
      },

      profSubmit: (chosenType) => {
        this.setState({chosenType})
      },

      submitChat: (message) => {
        this.setState({messages: this.state.messages.concat(message)})
      }
    }
  }


  render() {
    return (
      <div>
      <Header 
        redirect={this.state.redirect.bind(this)}/>
      </div>
    )
  }

};
export default App;
 

     //  <Recipe recipes={this.state.recipes} />

      // <ProfileMake
      // choices={this.state.choices} 
      // prep={this.state.prep} 
      // budget={this.state.budget}

      // setBudget={this.setBudget.bind(this)}
      // setPrep={this.setPrep.bind(this)}
      // profSubmit={this.profSubmit.bind(this)}/> 

     //<PairChatRoom 
    // messages={this.state.messages}
    // submitChat={this.submitChat.bind(this)}/>