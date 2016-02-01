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
      //USER INFO
      id: this.props.location.state.id,
      username: this.props.location.state.email,

      //PROFILE MAKE
      choices: {
        prep: ["Instant","Some prep","Lotta prep"],
        diet: ["None", "Lacto vegetarian", "Ovo vegetarian", "Pescetarian", "Vegan", "Vegetarian"],
        type: ["Foodie", "Diet"],
        allergies: ["Dairy", "Egg", "Gluten", "Peanut", "Seafood"]
      },

      prep: 0,
      diet: "",
      allergies: [],
      chosenType: "",

      setDiet: (diet) => {
        this.setState({diet: diet})
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
        console.log(this.state.diet)
        const prof = {
          diet: this.state.diet,
          cookingTime: this.state.prep +1,
          foodie: this.state.chosenType === "foodie"
        }
        $.post('/foodBot/profile/'+id, prof)
        this.state.redirect("Swipe Recipes")
      },

      //RECIPE CHOOSE
      recipes: [],
      getRecipes: () => {
        $.get('/foodBot/recipes/' + this.state.id)
          .done((result) => {
           console.log('api results', result.recipes);
            let r = [];
            r = result.recipes.map((currElement)=>{
            let obj = {};
            obj.id = currElement.id;
            obj.name = currElement.name;
            obj.img = currElement.image.replace('s90', 's300-c');
            obj.ingredients = currElement.ingredients;
            obj.cookingtime = currElement.cookingtime;
          // obj.rating = currElement.rating
            return obj;
        });
        console.log('recipes choose HERE ARE THE RECIPES>>>>>>>>>', r);
        this.setState({recipes: r});
      });
      },

      //RECIPE VIEW
      userMatch: "",
      getUserMatch: () => {
        $.get('/foodBot/match/:' + this.state.id)
          .done((result) => this.setState({userMatch: result}))
      },
      getChosenRecipes: () => {
        $.get('/foodBot/meals/:' + this.state.id)
          .done((result) => this.setState({chosenRecipes: result}))
      },

      chosenRecipes: [],

      getMatchRecipes: () => {
        $.get('foodBot/match/:' + this.state.id)
          .done((result) => this.setState({partnerRecipes: result}))
      },
      partnerRecipes: ["d", "e", "f", "g", "h"],

      //SOCIAL COMPONENT LOGIC
      messages: [],

      //ROUTING LOGIC
      currentView: this.props.location.state.route,
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
      }
    }
  }

  render() {
    //PROFILE MAKE
    if (this.state.componentRoute[this.state.currentView] === "ProfileMake") {
     return (
       <div>
        <Header redirect={this.state.redirect.bind(this)}/>
        <ProfileMake
          id = {this.state.id}
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
    //SWIPE RECIPES
    else if (this.state.componentRoute[this.state.currentView] === "RecipeChoose") {
      return (
        <div>
          <Header redirect={this.state.redirect.bind(this)} />
          <RecipeChoose
              id={this.state.id}
              setChosenRecipes={this.state.setChosenRecipes.bind(this)}
              getRecipes={this.state.getRecipes.bind(this)}
              recipes={this.state.recipes}
              userMatch={this.state.userMatch}/>

        </div>
      )
    }
    //VIEW PAIR AND RECIPES
    else if (this.state.componentRoute[this.state.currentView] === "RecipeView") {
      return (
        <div>
          <Header redirect={this.state.redirect.bind(this)} />
          <PairChatRoom
            getUserMatch= {this.state.getUserMatch.bind(this)}
            getChosenRecipes= {this.state.getChosenRecipes.bind(this)}
            getMatchRecipes= {this.state.getMatchRecipes.bind(this)}
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
