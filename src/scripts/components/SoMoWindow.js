import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import RaisedButton from 'material-ui/lib/raised-button';
import ReactDOM from 'react-dom';
import PairMessagesList from './PairMessagesList'


export default class SoMoWindow extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
          messages: [],
          submitChat: (message) => {
            console.log(message)
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
                <h3>{this.props.activeItem}</h3>                      
            </Modal.Header>
            <Modal.Body>
                <h2>Comment Window</h2>
                 <PairMessagesList 
                    username={this.props.username}/>
            </Modal.Body>
            <Modal.Footer>
            <RaisedButton label="Add to Cart" secondary={true} />
            <RaisedButton label="Close" secondary={true} onClick={this.props.close}/>          
            </Modal.Footer>
            </Modal> 
        )
    }
}