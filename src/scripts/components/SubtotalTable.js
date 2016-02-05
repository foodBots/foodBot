import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import RaisedButton from 'material-ui/lib/raised-button';

export default class SubtotalTable extends React.Component {

  constructor(props) {
      super(props);
    }



  renderRow (element) {
    this.forceUpdate();
    return (
    <div>
    {element.name} {element.price}
    </div>
    )
  }

  render() {        
    return (
     <div>
     <table>
      <tbody>
      <tr>
        <th>Meal Name</th>
        <th>Price</th> 
      </tr>
      <tr>
        <td>{this.props.recentItem.name}</td>
        <td>${this.props.recentItem.price}</td> 
      </tr>
      <tr>        
      </tr>
      <tr>
        <th>Total Cost</th>
        <td>${this.props.subtotal}</td>
      </tr>
      </tbody>
    </table>   
    {this.props.cart.map((element) => {this.renderRow(element)})}                        
    </div>
    )
  }
}

