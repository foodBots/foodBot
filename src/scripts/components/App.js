import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import Header from './Header.js'
import SignIn from './SignIn'
import ProfileMake from './ProfileMake'
import RecipeChoose from './RecipeChoose'
import RecipesBuy from './RecipesBuy'

import { Modal, Button } from 'react-bootstrap';
import RaisedButton from 'material-ui/lib/raised-button';

//This needs to be refactored to the Explore and Socialize Page
import RecipeLanding from './RecipeLanding'

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      //MODAL
      isModalOpen: false,
      close: () => {
        this.setState({ isModalOpen: false });
      },
      showModal: () => {
        this.setState({ isModalOpen: true });
      },

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

      setAllergies: (allergies) => {
        this.setState({
          allergies: this.state.allergies.concat(allergies)
        });
      },

      profSubmit: (chosenType) => {
        const isFoodie = chosenType === "Foodie";

        this.setState({chosenType})
        const id = this.state.id

        console.log('chosenType', chosenType)
        const prof = {
          diet: this.state.diet,
          cookingTime: this.state.prep.value +1,
          foodie: isFoodie,
          allergies: this.state.allergies
        }

        $.ajax({
          url: '/foodBot/profile/'+id,
          type: 'PUT',
          data: prof
        }).done((result)=> {
          this.state.redirect("Swipe Recipes")
        })
        .fail((error) => {
          console.log('error updating profile');
        });
      },

      //RECIPE CHOOSE
      setChosenRecipes: (chosenRecipes) => {
        this.setState({chosenRecipes})
      },
      recipes: [],
      recipesObj: {
        liked: [],
        rejected: []
      },
      getRecipes: () => {
        $.get('/foodBot/recipes/' + this.state.id)
          .done((result) => {
            console.log('recipe results', result);
            let r = [];
            r = result.recipes.map((currElement)=>{
            let obj = {};
            obj.id = currElement.id;
            obj.name = currElement.name;
            obj.img = currElement.image.replace('s90', 's300-c');
            obj.ingredients = currElement.ingredients;
            obj.cookingtime = currElement.cookingtime;
            return obj;
        });
          this.setState({recipes: r});
        });
      },
      saveMatch: () => {
        this.state.setChosenRecipes(this.state.recipesObj.liked);
        $.post('/foodBot/meals/' + this.state.id, this.state.recipesObj)
        .done((result) => {
          console.log(result, "REDIS RESULT")
        })
        this.state.close();
      },

      goCheckout:() => {
        event.preventDefault();
        console.log("Go to checkout")
      },

      //RECIPE VIEW
      userMatch: "",
      matchRecipes: [],
      chosenRecipes: [],
      getChosenRecipes: (id) => {
        $.get('/foodBot/meals/' + id).
          done((data) => {
          console.log("data you got back is..", data)
          this.setState({chosenRecipes: data.recipeView})
        })
      },
      getMatchRecipes: (id) => {
        $.get('/foodBot/meals/' + id).
          done((data) => {
          console.log("data you got back from match is..", data)
          this.setState({matchRecipes: data.recipeView})
        })
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
        "PairChatRoom": "PairChatRoom",
        "Buy Recipes": "RecipesBuy"
      },

      redirect: (text) => {
        if (this.state.currentView==="Swipe Recipes") {
          this.state.saveMatch();
        }
        console.log("route is", this.state.componentRoute[text])
        this.setState({currentView: text});
      },
    }
  }

  //load initial state from db
  componentDidMount() {

    // $.post('/foodBot/auth/signin', user).done((result) => {
    //   user = result;
    //   user.route = 'Swipe Recipes';
    // })
    // .fail((error) => {
    //   if(error.status === 400) {
    //     alert("NOOOO")
    //     this.setState({error:error.responseText});
    //     // console.log(error.responseText);
    //     // this.refs.signupForm.reset();
    //   }
    // });
  }

  render() {
    //PROFILE MAKE WHEN UPDATING
    if (this.state.componentRoute[this.state.currentView] === "ProfileMake") {
     return (
       <div >
        <Header redirect={this.state.redirect.bind(this)}/>
        <div className="profile-container">
        <ProfileMake
          id = {this.state.id}
          redirect={this.state.redirect}
          prep={this.state.prep}
          diet={this.state.diet}
          setDiet={this.state.setDiet.bind(this)}
          setPrep={this.state.setPrep.bind(this)}
          setAllergies={this.state.setAllergies.bind(this)}
          profSubmit={this.state.profSubmit.bind(this)}/>
        </div>
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
              getRecipes={this.state.getRecipes.bind(this)}
              setChosenRecipes={this.state.setChosenRecipes.bind(this)}
              recipes={this.state.recipes}
              recipesObj={this.state.recipesObj}
              saveMatch={this.state.saveMatch.bind(this)}
              userMatch={this.state.userMatch}
              showModal={this.state.showModal.bind(this)}/>

          <Modal
            show={this.state.isModalOpen}
            onHide={this.state.close}
            container={this}
            bsSize="small"
            enforceFocus={true}>
          <Modal.Header closeButton><h3>Cart Subtotal(1 item)</h3> </Modal.Header>
          <Modal.Body>
          <table>
            <tr>
              <th>Small Picture</th>
              <th>Meal Name</th>
            </tr>
            <tr>
              <td>Ingredient1</td>
              <td>$5.00</td>
            </tr>

            <tr>
              <th>Total Cost</th>
              <th>$25.95</th>
            </tr>
          </table>
          <button>Portions?</button> <button>Delete</button> <button>Save for later</button>
          </Modal.Body>
          <Modal.Footer>
          <RaisedButton label="Keep Swiping!" secondary={true} onClick={this.state.saveMatch}/>
          <RaisedButton label="Checkout" primary={true} onClick={this.state.goCheckout} />
          </Modal.Footer>
          </Modal>
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
            getChosenRecipes={this.state.getChosenRecipes.bind(this)}
            getMatchRecipes={this.state.getMatchRecipes.bind(this)}
            chosenRecipes={this.state.chosenRecipes}
            matchRecipes={this.state.matchRecipes}
            //social
            messages={this.state.messages}
            submitChat={this.state.submitChat}/>
        </div>
      )
    }
    else if(this.state.componentRoute[this.state.currentView] ==="RecipesBuy"){
      return (
        <div>
          <Header redirect={this.state.redirect.bind(this)} />
          <RecipesBuy recipes={this.state.recipesObj.liked}/>
        </div>
      )
    }
    else {
      <NotFound />
    }
  }
};
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
