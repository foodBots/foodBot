/*
  Header
  <Header/>
*/

import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import Avatar from 'material-ui/lib/avatar';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';

class FoodDiet extends React.Component {
  
  chooseProf() {
    console.log('hi')
  }
  
  render() {
    return (
      var styleMap = this.mountStyles`

      .flexbox-container {
        display: -ms-flex;
        display: -webkit-flex;
        display: flex;
      }

      .flexbox-container > div {
        width: 50%;
        padding: 10px;
      }

      .flexbox-container > div:first-child {
        margin-right: 20px;
      }`
      <div className={styleMap.flexbox-container}>
      <h2>Testing</h2>
       <div>
        <Card>
          <CardHeader
            avatar="http://gourmetculture.com/wp-content/uploads/2014/12/foodie-crossing-close-up.jpg"/>
          
          <CardTitle title="Foodie" subtitle="Something Foodie"/>
          
          <CardActions>
            <FlatButton label="Choose" onClick={this.chooseProf}/>
          </CardActions>
          
          <CardText>
            Choose me!
          </CardText>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader
            avatar="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSeZltLMUgZrzx_VAM8ZzZqetAHma5lLCEseCO-Xlo1yZRy0I-eog"/>
          <CardTitle title="Diet" subtitle="Something Diet"/>
          <CardActions>
            <FlatButton label="Choose" onClick={this.chooseProf}/>
          </CardActions>
          <CardText>
            No. Choose me
          </CardText>
        </Card>
      </div>
    </div>
    )
  }
}


export default FoodDiet;
