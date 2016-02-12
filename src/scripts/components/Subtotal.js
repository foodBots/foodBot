import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import RaisedButton from 'material-ui/lib/raised-button';
import ShoppingCart from 'material-ui/lib/svg-icons/action/shopping-cart';
import Undo from 'material-ui/lib/svg-icons/content/undo';
import ArrowBack from 'material-ui/lib/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/lib/icon-button';
import SubtotalTable from './SubtotalTable'

export default class Subtotal extends React.Component {

    constructor(props) {
      super(props);
    }

    render() {    
      return (
       <Modal 
            show={this.props.isModalOpen} 
            onHide={this.props.close}
            container={this}
            bsSize="large"
            enforceFocus={true}>
          <Modal.Header closeButton>
              <center>
                <h3><strong>Shopping Cart </strong></h3> 
                <h4>({this.props.cart.length} items)</h4>    
              </center>
          </Modal.Header>
          <Modal.Body>
            <SubtotalTable
                recentItem={this.props.recentItem}
                cart={this.props.cart} 
                subtotal={this.props.total}/>
          </Modal.Body>
          <Modal.Footer>
          <IconButton onTouchTap={this.props.saveMatch}><ArrowBack color="#1DB272"/></IconButton>  
          <IconButton onTouchTap={this.props.removeFromCart}><Undo color="#1DB272"/></IconButton>
          <IconButton onTouchTap={this.props.goCheckout}><ShoppingCart color="#B2240B"/></IconButton> 
          </Modal.Footer>
          </Modal> 
      )
    }
  }
