import React from 'react';

import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardText from 'material-ui/lib/card/card-text';
import CardMedia from 'material-ui/lib/card/card-media';

const Card ({recipe}) => {
  return (
    <div>
      <Card style={this.style}>
      <CardMedia>
      <img src ="http://25.media.tumblr.com/tumblr_m2zle0WyK31r5wwyho1_500.png"/>
      </CardMedia>
      <CardText>
        Hello {element}
      </CardText>
      <CardActions>
        <button onClick={this.next}>Next</button>
        <button onClick={this.yes}>Yes</button>   
      </CardActions>
      </Card>     


    </div>

  )
}

export default Card