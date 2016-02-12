import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import RaisedButton from 'material-ui/lib/raised-button';
import LocalShipping from 'material-ui/lib/svg-icons/maps/local-shipping';
import ShoppingCart from 'material-ui/lib/svg-icons/action/shopping-cart';
import PlayCircleOutline from 'material-ui/lib/svg-icons/av/play-circle-outline';
import Kitchen from 'material-ui/lib/svg-icons/places/kitchen';
import IconButton from 'material-ui/lib/icon-button';
import ReactDOM from 'react-dom';
import PairMessagesList from './PairMessagesList';
import Avatar from 'material-ui/lib/avatar';
import Snackbar from 'material-ui/lib/snackbar';


export default class SoMoWindow extends React.Component {

    constructor(props){
        super(props)
        this.state = {
          open: false,
          openLike: false,
          messages: [],
          submitChat: (message) => {
            this.setState({messages: this.state.messages.concat(message)})          
          },
          activeItem: this.props.activeItem
        }

    }
    
    renderMessage(message, index){
        return (
            <li className="somo-message" key={index}>
                <div className="somo-name">
                </div>
            <h5><strong>{this.props.username}:</strong></h5>
            <span>{message}</span>
            </li>
        )
    }

    handleTouchTap () {
      this.setState({
        open: true,
      });
      this.props.addToCart();
    }

    handleTouchLike(){
      this.setState({
        openLike:true,
      })
      this.props.addToLiked()
    }

    handleRequestClose() {
      this.setState({
        open: false,
        openLike: false
      });
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
            <input placeholder="Add a comment..." ref='msg' />
        </form>
      )
    }

    render(){        
        return (
            <div>
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
                    <h2 className="somo-comment-header">Comments:</h2>
                     <PairMessagesList 
                        photo={this.props.userphoto}
                        name={this.props.name}
                        activeItemId={this.props.activeItemId}
                        activeProfId={this.props.activeProfId}
                        activeItemPrice={this.props.activeItemPrice}/>
                </Modal.Body>
                <Modal.Footer>
                    <IconButton onTouchTap={this.handleTouchLike.bind(this)}><Kitchen color="#4B78CB"/></IconButton>
                    <IconButton onTouchTap={this.handleTouchTap.bind(this)}><ShoppingCart color="#B2240B"/></IconButton> 
                </Modal.Footer>
                </Modal> 
                <Snackbar
                  open={this.state.open}
                  message= {"Item added to cart $" + this.props.activeItemPrice}
                  autoHideDuration={4000}
                  onRequestClose={this.handleRequestClose.bind(this)}/>
                 <Snackbar
                  open={this.state.openLike}
                  message= {"Item added to favorites"}
                  autoHideDuration={4000}
                  onRequestClose={this.handleRequestClose.bind(this)}/>
            </div>
        )
    }
}