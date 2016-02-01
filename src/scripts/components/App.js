import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header.js'
import ProfileMake from './ProfileMake'
import RecipeChoose from './RecipeChoose'
import RecipeView from './RecipeView'
import SignIn from './SignIn'
import PairChatRoom from './PairChatRoom'
import $ from 'jquery';


class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      id: this.props.location.state.id,

      choices: {
        prep: ["Instant","Some prep","Lotta prep"],
        diet: ["None", "Lacto vegetarian", "Ovo vegetarian", "Pescetarian", "Vegan", "Vegetarian"],
        type: ["Foodie", "Diet"],
        allergies: ["Dairy", "Egg", "Gluten", "Peanut", "Seafood"]
      },

      prep: {
        value: 1,
        text: ""
      },

      diet: {
        value: 0,
        text: ""
      },

      allergies: [],

      currentView: this.props.location.state.route,
      username: this.props.location.state.email,
      userMatch: "",
      chosenType: "",

      //Recipes from GET request go here
      recipes: [],

      chosenRecipes: [],
      partnerRecipes: ["d", "e", "f", "g", "h"],

      messages: [],

      componentRoute: {
        "Profile Settings": "ProfileMake",
        "Swipe Recipes": "RecipeChoose",
        "View Recipes": "RecipeView",
        "Sign out": "SignIn",
        "PairChatRoom": "PairChatRoom"
      },


      redirect: (text) => {
        console.log("route is", this.state.componentRoute[text])
        this.setState({currentView: text});
      },

      setDiet: (diet) => {
        this.setState({diet})
      },

      setPrep: (prep) => {
        this.setState({prep})
      },

      setChosenRecipes: (chosenRecipes) => {
        this.setState({chosenRecipes})
      },

      profSubmit: (chosenType) => {
        this.setState({chosenType})                
        const id = this.props.location.state.id.id
        const prof = {
          diet: this.state.diet,
          cookingTime: this.state.prep.value +1,
          foodie: this.state.chosenType === "foodie"
        }
        $.post('/foodBot/profile/'+id, prof)
        this.state.redirect("Swipe Recipes")
      },
    }
    //getInitialState()
  }

  render() {
    if (this.state.componentRoute[this.state.currentView] === "ProfileMake") {
     return (
       <div>
        <Header redirect={this.state.redirect.bind(this)}/>
        <ProfileMake
          redirect={this.state.redirect}
          choices={this.state.choices}
          prep={this.state.prep}
          diet={this.state.diet}
          setDiet={this.state.setDiet.bind(this)}
          setPrep={this.state.setPrep.bind(this)}
          profSubmit={this.state.profSubmit.bind(this)}/>
       </div>
     )
    }
    else if (this.state.componentRoute[this.state.currentView] === "RecipeChoose") {
      return (
        <div>
          <Header redirect={this.state.redirect.bind(this)} />

          <RecipeChoose id={this.state.id} setChosenRecipes={this.state.setChosenRecipes.bind(this)} userMatch={this.state.userMatch}/>

        </div>
      )
    }
    else if (this.state.componentRoute[this.state.currentView] === "RecipeView") {
      return (
        <div>
          <Header redirect={this.state.redirect.bind(this)} />
          <PairChatRoom
            username ={this.state.username}
            match={this.state.userMatch}
            chosenRecipes={this.state.chosenRecipes}
            matchRecipes={this.state.matchRecipes}
            messages={this.state.messages}
            submitChat={this.state.submitChat}/>
        </div>
      )
    }
    else {
      <NotFound />
    }
  }

};
export default App;
