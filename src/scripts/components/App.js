import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header.js'
import ProfileMake from './ProfileMake'
import RecipeChoose from './RecipeChoose'
import RecipeView from './RecipeView'
import SignIn from './SignIn'
import RecipeLanding from './RecipeLanding'
import $ from 'jquery';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      //USER INFO
      id: this.props.location.state.id,
      username: this.props.location.state.email,

      //PROFILE MAKE
      prep: {
        value: 0,
        text: ""
      },
      diet: {
        value: 0,
        text: ""
      },
      chosenType: "",
      allergies: [],


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
        const id = this.state.id

        console.log('chosenType', chosenType)
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
      recipesObj: {
        liked: [],
        rejected: []
      },
      getRecipes: () => {
        console.log(this.state.id, "asdkfhjlsakjdf")
        $.get('/foodBot/recipes/' + this.state.id)
          .done((result) => {
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
          console.log('recipes choose HERE ARE THE RECIPES>>>>>>>>>');
          this.setState({recipes: r});
          });
      },
      saveMatch: () => {
        // console.log('Your match is', this.props.userMatch)
        // this.openModal();
        console.log('saveMatch recipesObj', this.state.recipesObj);
        this.state.setChosenRecipes(this.state.recipesObj.liked);
        $.post('/foodBot/meals/' + this.state.id, this.state.recipesObj)
        .done((result) => {
          console.log('posted recipes', this.state.recipesObj)
        })
      },

      //RECIPE VIEW
      userMatch: "",
      partnerRecipes: [],
      chosenRecipes: [],
      getUserMatch: () => {
        $.get('/foodBot/match/:' + this.state.id)
          .done((result) => this.setState({userMatch: result}))
      },
      getChosenRecipes: () => {
        $.get('/foodBot/meals/:' + this.state.id)
          .done((result) => this.setState({chosenRecipes: result}))
      },
      getMatchRecipes: () => {
        $.get('foodBot/match/:' + this.state.id)
          .done((result) => this.setState({partnerRecipes: result}))
      },


      //SOCIAL COMPONENT LOGIC
      messages: [],

      //ROUTING LOGIC
      currentView: this.props.location.state.route,
      componentRoute: {
        "Profile Settings": "ProfileMake",
        "Swipe Recipes": "RecipeChoose",
        "View Recipes": "RecipeView",
        "Sign Up": "SignUp",
        "Sign out": "SignIn",
        "PairChatRoom": "PairChatRoom"
      },

      redirect: (text) => {
        //if currentView was RecipesChoose, save liked recipes before changing views
        if (this.state.currentView==="Swipe Recipes") {
          this.state.saveMatch();
        }
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
    if (this.state.componentRoute[this.state.currentView] === "RecipeChoose") {
      return (
        <div>
          <Header redirect={this.state.redirect.bind(this)} />
          <RecipeChoose
              id={this.state.id}
              setChosenRecipes={this.state.setChosenRecipes.bind(this)}
              getRecipes={this.state.getRecipes.bind(this)}
              recipes={this.state.recipes}
              recipesObj={this.state.recipesObj}
              saveMatch={this.state.saveMatch.bind(this)}
              userMatch={this.state.userMatch}/>
        </div>
      )
    }
    //VIEW PAIR AND RECIPES
    else if (this.state.componentRoute[this.state.currentView] === "RecipeView") {
      return (
        <div>
          <Header redirect={this.state.redirect.bind(this)} />
          <RecipeLanding
            username ={this.props.location.state.id}
            match={this.props.location.state.matchData.id}
            chosenRecipes={this.props.location.state.recipesData}
            matchRecipes={this.props.location.state.matchData.recipes}

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

//UPDATE PROFILE
    // else if (this.state.componentRoute[this.state.currentView] === "ProfileMake") {
    //  return (
    //    <div>
    //     <Header redirect={this.state.redirect.bind(this)}/>
    //     <ProfileMake
    //       id = {this.state.id}
    //       redirect={this.state.redirect}
    //       choices={this.state.choices}
    //       prep={this.state.prep}
    //       diet={this.state.diet}
    //       setDiet={this.state.setDiet.bind(this)}
    //       setPrep={this.state.setPrep.bind(this)}
    //       profSubmit={this.state.profSubmit.bind(this)}/>
    //    </div>
    //  )
    // }
