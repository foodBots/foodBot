import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Header from './Header.js'
import SignIn from './SignIn'
import ProfileMake from './ProfileMake'
import RecipeChoose from './RecipeChoose'
import RecipesBuy from './RecipesBuy'
import MyRecipes from './MyRecipes'
import Subtotal from './Subtotal'
import Explore from './ExploreRecipes'
import SoMoWindow from './SoMoWindow'
import Rebase from 're-base'

import { Modal, Button } from 'react-bootstrap';
import RaisedButton from 'material-ui/lib/raised-button';

let base = Rebase.createClass('https://dazzling-inferno-511.firebaseio.com/shoppingCart')


//This needs to be refactored to the Explore and Socialize Page

export default class App extends React.Component {

  componentDidMount() {
    base.syncState('user' + this.state.id + 'shoppingCart', {
      context: this,
      state: 'cart',
      asArray: true
    })
    //get init user req session.
    $.get('/foodBot/auth/signin').done((result)=> {
      // console.log('init results', result);
      const returnedId = result.id;
      //initialize profile
      this.state.id = returnedId;
      this.state.currentView = 'Swipe Recipes';
      // $.post('')
      // const prof = {
      //   diet: '',
      //   cookingTime: 1,
      //   foodie: true,
      //   allergies: []
      // };
      // $.post('/foodBot/profile/'+ returnedId, prof)
      // .done((result) => {
      //   // user.route = 'Swipe Recipes';
      //   // user.diet = this.state.diet;
      //   // user.cookingTime = this.state.prep.value;
      //   // user.foodie = this.state.chosenType === "foodie";
      //   // user.allergies = this.state.allergies
      //   console.log('retrieved user', result)
      // })
      // .fail((error) =>{
      //   console.log('error creating profile', error);
      // })
    })
    .fail((error) => {
      console.log('error getting user session', error);
    })
  }

  componentWillMount(){
    this.state.getTotal();
  }

  constructor(props) {
    super(props);

    this.state = {
      //USER INFO
      id: 0,
      name: '',
      // photo: this.state.location.

      //ROUTING LOGIC
      currentView: 'Profile Settings',
      componentRoute: {
        "Profile Settings": "ProfileMake",
        "Swipe Recipes": "RecipeChoose",
        "Explore Recipes": "ExploreRecipes",
        "Sign Out": "SignIn",
        "Sign Up": "SignUp",
        "PairChatRoom": "PairChatRoom",
        "Buy Recipes": "RecipesBuy",
        "My Recipes": "MyRecipes"
      },

      chosenRecipes: [],
      cart: [],

      getTotal: () => {
        let newTotal = 0;
        this.state.cart.forEach((element) => newTotal += element.price)
        this.setState({total: newTotal})
      },

      recentItem: "",
      activeItem: "",
      activeItemId: "",
      activeProfId: "",
      activeItemPrice: "",
      activeImage: "",

      //NAV BAR
      open: false,
      handleToggle: () => {
        console.log("toggle being handled from APP")
        this.setState({open: !this.state.open})
      },

      handleClose: () => {
        this.setState({open: false})
      },

      //SUBTOTAL VIEW
      isModalOpen: false,
      close: () => {
        this.setState({ isModalOpen: false });
      },

      showModal: (element) => {
        let recent = {
          recipeid: element.id,
          name: element.name,
          image: element.image,
          price: element.price
        }

      this.setState({cart: this.state.cart.concat(recent), recentItem: recent, isModalOpen: true}, () => {
          this.state.getTotal().bind(this)})
      },

      removeFromCart: () => {
        let cart = this.state.cart.slice()
        var item = cart.pop()
        let newTotal = this.state.total
        newTotal = newTotal - item.price
        this.setState({cart: cart, total: newTotal})
      },

      removeOrder: (element) => {
        let cart = this.state.cart.slice()
        cart.splice(cart.indexOf(element), 1)
        let newTotal = this.state.total
        newTotal = newTotal - element.price
        this.setState({cart: cart, total: newTotal})
      },

      addToCart: () => {
       let recent = {
          recipeid: this.state.activeItemId,
          name: this.state.activeItem,
          price: this.state.activeItemPrice,
          image: this.state.activeImage,
          profileid: this.state.activeProfId
        }

        console.log("the recent.....", recent)
        this.setState({ cart: this.state.cart.concat(recent), recentItem: recent, isModalOpen: false})
      },

      addToLiked: () => {
        this.state.recipesObj.liked.push(this.state.activeItemId)
        this.setState({recipesObj: this.state.recipesObj})
        this.state.saveMatch()
      },

      openSocialModal: (element) => {
        this.setState({ isModalOpen: true, activeItem: element.name, activeItemId: element.id, activeProfId: element.profileid, activeItemPrice: element.priceestimate, activeImage: element.image});
      },

      orderCheckout: () => {
        console.log(this.state.cart, this.state.total)
        let order = {
          recipes: this.state.cart,
          order: {
            total: this.state.total
          }
        }

        $.post('/foodbot/orders/' + this.state.id, order)
          .done((result) => {
            this.setState({cart: [], total: 0})

            //Needs to get My Recipes ASAP
            this.state.redirect('My Recipes')})
      },

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
          type: 'POST',
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
            var final = []
            var r = result.reduce(function(acc, memo) {                            
                //if it exists in the hash, push only the ingredient data
                if (acc[memo.id]) {
                  acc[memo.id].ingredients.push({
                    description: memo.description,
                    price: memo.price
                  })                  
                } else {
                //If it does not, rebuild it within the object
                  acc[memo.id] = {
                    id: memo.id,
                    name: memo.name,
                    image: memo.image,
                    ingredients: [],
                    price: memo.priceestimate                    
                  }
                  acc[memo.id].ingredients.push({
                    description: memo.description,
                    price: memo.price
                  })
                }
                return acc;
              }, {})

            for (var key in r) {              
                final.push(r[key])
            }
          this.setState({recipes: final});
        });
      },
      saveMatch: () => {
        this.state.setChosenRecipes(this.state.recipesObj.liked);
        $.post('/foodBot/meals/' + this.state.id, this.state.recipesObj)
        .done((result) => {
          this.setState({
            recipesObj: {
              liked: [],
              rejected: []
            }
          })
        })
        this.state.close();
      },

      goCheckout:() => {
        event.preventDefault();
        console.log("Go to checkout")
        // this.state.saveMatch
        this.state.redirect("Buy Recipes")
      },

      getChosenRecipes: (id) => {
        $.get('/foodBot/meals/' + id).
          done((data) => {
          console.log('chosen recipe data', data);
          this.setState({chosenRecipes: data.recipeView})
        })
      },

      //EXPLORE RECIPES
      getExploreRecipes: (id) => {
        console.log("exploring recipes")
        $.get('/foodBot/meals/explore/' + id).
          done((data) => {
          console.log("got explored recipes", data)
          this.setState({exploreRecipes: data})
        })
      },
      exploreRecipes: [],


      redirect: (text) => {
        if (this.state.currentView==="Swipe Recipes") {
          this.state.saveMatch();
        }
        console.log("route is", this.state.componentRoute[text])
        this.setState({currentView: text});
      }
    }
  }

  render() {
    if (this.state.componentRoute[this.state.currentView] === "ProfileMake") {
      return (
       <div>
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
          profSubmit={this.state.profSubmit.bind(this)}

          handleToggle={this.state.handleToggle}
          handleClose={this.state.handleClose}
          open={this.state.open}
          />
        </div>
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
            getRecipes={this.state.getRecipes.bind(this)}
            setChosenRecipes={this.state.setChosenRecipes.bind(this)}
            recipes={this.state.recipes}
            recipesObj={this.state.recipesObj}
            saveMatch = {this.state.saveMatch.bind(this)}
            userMatch={this.state.userMatch}
            showModal={this.state.showModal.bind(this)}
            recentItem = {this.state.recentItem}/>
        <Subtotal
          //Actions
          showModal = {this.state.showModal.bind(this)}
          saveMatch = {this.state.saveMatch.bind(this)}
          close ={this.state.close.bind(this)}
          goCheckout = {this.state.goCheckout.bind(this)}
          redirect = {this.state.redirect.bind(this)}

          //Props
          isModalOpen={this.state.isModalOpen}
          recentItem = {this.state.recentItem}
          removeFromCart = {this.state.removeFromCart}
          cart = {this.state.cart}
          total={this.state.total}/>
       </div>
      )
    }
     //EXPLORE RECIPES FROM OTHER USERS
    else if (this.state.componentRoute[this.state.currentView] === "ExploreRecipes") {
      return (
        <div>
          <Header redirect={this.state.redirect.bind(this)} />
          <Explore
            className="myrecipe-container"
            id={this.state.id}
            getExploreRecipes={this.state.getExploreRecipes}
            exploreRecipes={this.state.exploreRecipes}
            openSocialModal={this.state.openSocialModal.bind(this)}
            close={this.state.close.bind(this)}
            isModalOpen={this.state.isModalOpen}/>
          <SoMoWindow
          //Actions
          close ={this.state.close.bind(this)}
          isModalOpen={this.state.isModalOpen}
          addToCart={this.state.addToCart.bind(this)}
          addToLiked={this.state.addToLiked.bind(this)}
          name={this.state.name}
          activeItem={this.state.activeItem}
          activeItemId={this.state.activeItemId}
          activeProfId={this.state.activeProfId}
          activeImage={this.state.activeImage}
          activeItemPrice={this.state.activeItemPrice}/>
          </div>
      )
    }
    else if(this.state.componentRoute[this.state.currentView] ==="RecipesBuy"){
      return (
        <div>
          <Header redirect={this.state.redirect.bind(this)} />
          <RecipesBuy
            recipes={this.state.recipesObj.liked}
            cart={this.state.cart}
            total={this.state.total}
            getTotal={this.state.getTotal.bind(this)}
            removeOrder={this.state.removeOrder}
            orderCheckout={this.state.orderCheckout.bind(this)}/>
        </div>
      )
    }
    else if(this.state.componentRoute[this.state.currentView] ==="MyRecipes"){
      return (
        <div>
          <Header redirect={this.state.redirect.bind(this)} />
          <MyRecipes
            chosenRecipes = {this.state.chosenRecipes}
            userid={this.state.id}
            getChosenRecipes = {this.state.getChosenRecipes}/>
        </div>
      )
    }
    else {
      <NotFound />
    }
  }
}
            // recipes={this.props.location.state.recipesData}
// UPDATE PROFILE
//     else if (this.state.componentRoute[this.state.currentView] === "ProfileMake") {
//      return (
//        <div>
//         <Header redirect={this.state.redirect.bind(this)}/>
//         <ProfileMake
//           id = {this.state.id}
//           redirect={this.state.redirect}
//           choices={this.state.choices}
//           prep={this.state.prep}
//           diet={this.state.diet}
//           setDiet={this.state.setDiet.bind(this)}
//           setPrep={this.state.setPrep.bind(this)}
//           profSubmit={this.state.profSubmit.bind(this)}/>
//        </div>
//      )
//     }

