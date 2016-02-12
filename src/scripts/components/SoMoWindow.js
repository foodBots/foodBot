import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import RaisedButton from 'material-ui/lib/raised-button';
import ReactDOM from 'react-dom';
import PairMessagesList from './PairMessagesList';
import Avatar from 'material-ui/lib/avatar';
import Snackbar from 'material-ui/lib/snackbar';


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

    handleRequestClose() {
      this.setState({
        open: false,
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
                        userPhoto={this.props.userphoto}
                        name={this.props.name}
                        activeItemId={this.props.activeItemId}
                        activeProfId={this.props.activeProfId}
                        activeItemPrice={this.props.activeItemPrice}/>
                </Modal.Body>
                <Modal.Footer>
                <RaisedButton label="Close" secondary={true} onClick={this.props.close}/>
                <RaisedButton label="Save" secondary={true} onClick={this.props.addToLiked}/>                    
                <RaisedButton label="Add to Cart" primary={true} onTouchTap={this.handleTouchTap.bind(this)} />
                </Modal.Footer>
                </Modal> 
                <Snackbar
                  open={this.state.open}
                  message="Item added to cart"
                  autoHideDuration={4000}
                  onRequestClose={this.handleRequestClose.bind(this)}
                />
            </div>
        )
    }
}