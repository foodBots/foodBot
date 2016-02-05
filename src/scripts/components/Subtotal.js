import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import RaisedButton from 'material-ui/lib/raised-button';

import SubtotalTable from './SubtotalTable'

export default class Subtotal extends React.Component {

    constructor(props) {
      super(props);
    }

    componentWillReceiveProps() {
      this.setState({
        cart: this.props.cart
      })
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
              <h3>Cart Subtotal (4 items)</h3>          
              <RaisedButton label="Checkout" primary={true} onClick={this.props.goCheckout} />
          </Modal.Header>
          <Modal.Body>
            <SubtotalTable
                recentItem={this.props.recentItem}
                cart={this.props.cart} 
                subtotal={this.props.subtotal}/>
          </Modal.Body>
          <Modal.Footer>
          <RaisedButton label="Remove" secondary={true} onClick={this.props.removeRecent}/>
          <RaisedButton label="Keep Swiping!" secondary={true} onClick={this.props.saveMatch}/>          
          </Modal.Footer>
          </Modal> 
      )
    }
  }
