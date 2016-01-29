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
      chosenType: "",

      //Recipes from GET request go here
      recipes: [],
      chosenRecipes: ["a", "b", "c", "d", "d"],
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
          <RecipeChoose />
        </div>
      )
    }
    else if (this.state.componentRoute[this.state.currentView] === "RecipeView") {
      console.log("You're in Recipe View")
      return (
        <div>
          <Header redirect={this.state.redirect.bind(this)} />
          <PairChatRoom
            messages={this.state.messages}
            submitChat={this.state.submitChat.bind(this)}/>
        </div>
      )
    }
    else {
      <NotFound />
    }
  }

};
export default App;


  // <Recipe recipes={this.state.recipes} />
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
     //  <Recipe recipes={this.state.recipes} />

      // <ProfileMake
      // choices={this.state.choices}
      // prep={this.state.prep}
      // diet={this.state.diet}

      // setDiet={this.setDiet.bind(this)}
      // setPrep={this.setPrep.bind(this)}
      // profSubmit={this.profSubmit.bind(this)}/>

   
