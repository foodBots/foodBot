import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import RaisedButton from 'material-ui/lib/raised-button';
import ShoppingCart from 'material-ui/lib/svg-icons/action/shopping-cart';
import Delete from 'material-ui/lib/svg-icons/action/delete';
import Undo from 'material-ui/lib/svg-icons/content/undo';
import PlayCircleOutline from 'material-ui/lib/svg-icons/av/play-circle-outline';
import IconButton from 'material-ui/lib/icon-button';
import SubtotalTable from './SubtotalTable'

export default class Subtotal extends React.Component {

    constructor(props) {
      super(props);
      this.buttonStyles = {
        width: '40px', 
        height: '70px'
      }
      this.buttonBackgroundStyle = {
        width: '80px',
      }
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
          <IconButton style = {this.buttonBackgroundStyle} iconStyle={this.buttonStyles} onTouchTap={this.props.saveMatch}><PlayCircleOutline color="#1DB272"/></IconButton>  
          <IconButton style = {this.buttonBackgroundStyle} iconStyle={this.buttonStyles} onTouchTap={this.props.removeFromCart}><Delete color="#1DB272"/></IconButton>
          <IconButton style = {this.buttonBackgroundStyle} iconStyle={this.buttonStyles} onTouchTap={this.props.goCheckout}><ShoppingCart color="#B2240B"/></IconButton> 
          </Modal.Footer>
          </Modal> 
      )
    }
  }
