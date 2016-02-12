import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import RaisedButton from 'material-ui/lib/raised-button';
import LocalShipping from 'material-ui/lib/svg-icons/maps/local-shipping';
import ShoppingCart from 'material-ui/lib/svg-icons/action/shopping-cart';
import PlayCircleOutline from 'material-ui/lib/svg-icons/av/play-circle-outline';
import Kitchen from 'material-ui/lib/svg-icons/places/kitchen';
import IconButton from 'material-ui/lib/icon-button';
import ReactDOM from 'react-dom';
import PairMessagesList from './PairMessagesList'


export default class SoMoWindow extends React.Component {

    constructor(props){
        super(props)
        this.state = {
          messages: [],
          submitChat: (message) => {
            this.setState({messages: this.state.messages.concat(message)})          
          },
          activeItem: this.props.activeItem
        }
    }
    
    renderMessage(message, index){
        return (
            <li className="message" key={index}>{this.props.username}: {message}</li>
        )
    }

    renderChats() {
        return(    
          <ul className="comment-area">
            {this.state.messages.map((message, index) => this.renderMessage(message, index))}
          </ul>
        )
    }

    renderInput() { 
    return (
        <form onSubmit={(event) => {
            event.preventDefault();
            this.state.submitChat(this.refs.msg.value)
            ReactDOM.findDOMNode(this.refs.msg).value = "";
          }}>
            <input placeholder="SAY SOMETHING" ref='msg' />
        </form>
      )
    }

    render(){        
        return (
            <Modal 
                show={this.props.isModalOpen} 
                onHide={this.props.close}
                container={this}
                bsSize="large"
                enforceFocus={true}>
            <Modal.Header closeButton>
                <h3>{this.props.activeItem} (${this.props.activeItemPrice})</h3>                      
            </Modal.Header>
            <Modal.Body>
                <h2>Comment Window</h2>
                 <PairMessagesList 
                    name={this.props.name}
                    activeItemId={this.props.activeItemId}
                    activeProfId={this.props.activeProfId}
                    activeItemPrice={this.props.activeItemPrice}/>
            </Modal.Body>
            <Modal.Footer>
            <IconButton onTouchTap={this.props.close}><PlayCircleOutline color="#1DB272"/></IconButton>  
            <IconButton onTouchTap={this.props.addToLiked}><Kitchen color="#335CFF"/></IconButton>
            <IconButton onTouchTap={this.props.addToCart}><ShoppingCart color="#B2240B"/></IconButton> 
            </Modal.Footer>
            </Modal> 
        )
    }
}