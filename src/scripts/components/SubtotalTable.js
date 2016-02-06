import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import RaisedButton from 'material-ui/lib/raised-button';

export default class SubtotalTable extends React.Component {

  constructor(props) {
      super(props);
    }

  renderRow (element) {
    return (
    <tr>
      <td>{element.name}</td> 
      <td>${element.price}</td>
    </tr>
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
      {this.props.cart.map((element) => this.renderRow(element))}                        
      <tr>        
      </tr>
      <tr>
        <th>Total Cost</th>
        <td>${this.props.subtotal}</td>
      </tr>
      </tbody>
    </table>   
    </div>
    )
  }
}

