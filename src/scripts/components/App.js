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
        value: 0,
        text: ""
      },

      diet: {
        value: 0,
        text: ""
      },

      allergies: [],
      
      currentView: this.props.location.state.route,
      username: this.props.location.state.email,
      userMatch: "Tom",
      chosenType: "",

      //Recipes from GET request go here
      recipes: [],
      chosenRecipes: ["a", "b", "c", "d", "d"],
      matchRecipes: ["d", "e", "f", "g", "h"],

      messages: [],

      componentRoute: {
        "Profile Settings": "ProfileMake",
        "Swipe Recipes": "RecipeChoose",
        "View Recipes": "RecipeView",
        "Sign out": "SignIn",
        "PairChatRoom": "PairChatRoom"
      },
      // getRecipes: () => {
      //   $.get('http://api.yummly.com/v1/api/recipes?_app_id=99092447&_app_key=3059252f9c071f0adaea0a1d4c6e79a5&chicken')
      //   .done((result) => {
      //     // console.log(result.matches);
      //     let r = [];
      //     r = result.matches.map((currElement)=>{
      //       let obj = {};
      //       obj.id = currElement.id;
      //       obj.name = currElement.recipeName;
      //       obj.img = currElement.imageUrlsBySize['90'];
      //       obj.ingredients = currElement.ingredients;
      //       obj.cookingtime = currElement.totalTimeInSeconds;
      //       obj.rating = currElement.rating
      //       return obj;
      //     });
      //     console.log('recipes in App', r);
      //     this.setState({
      //       recipes: r
      //     });
      //   });
      // },

      redirect: (text) => {
        console.log("route is", this.state.componentRoute[text])
        this.setState({currentView: text});
        // this.props.history.pushState(this.state, "/" + this.state.componentRoute[text])
      },

      setDiet: (diet) => {
        this.setState({diet})
      },

      setPrep: (prep) => {
        this.setState({prep})
      },

      profSubmit: (chosenType) => {                
        this.setState({chosenType})
        console.log(this.props.location.state)
        const id = this.props.location.state.id.id
        console.log('ID POST PROPS:', id);
        const prof = {
          diet: this.state.diet,
          cookingTime: this.state.prep.value,
          foodie: this.state.chosenType === "foodie"
        }
        $.post('/foodBot/profile/'+id, prof)
        this.state.redirect("Swipe Recipes")
      },

      submitChat: (message) => {
        console.log(message)
        this.setState({messages: this.state.messages.concat(message)})
      }
    }
    // this.state.getRecipes();
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
          <RecipeChoose id={this.state.id}/>
        </div>
      )
    }
    else if (this.state.componentRoute[this.state.currentView] === "RecipeView") {
      return (
        <div>
          <Header redirect={this.state.redirect.bind(this)} />
          <PairChatRoom
            messages={this.state.messages}
            username ={this.state.username}
            match={this.state.userMatch}
            submitChat={this.state.submitChat.bind(this)}
            chosenRecipes={this.state.chosenRecipes}
            matchRecipes={this.state.matchRecipes}/>
        </div>
      )
    }
    else {
      <NotFound />
    }
  }

};
export default App;
