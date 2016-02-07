import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import RaisedButton from 'material-ui/lib/raised-button';

export default class SubtotalTable extends React.Component {

  constructor(props) {
      super(props);
    }

  renderRow (element, index) {
    return (
    <tr key={index}>
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
      {this.props.cart.map((element, index) => this.renderRow(element, index))}                        
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

