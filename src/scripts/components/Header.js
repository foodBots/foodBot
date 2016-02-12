/*
  Header
  <Header/>
*/
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

//NavBar
import {Nav, Navbar, NavItem, NavDropdown, MenuItem} from "react-bootstrap";

export default class Header extends React.Component {
  componentDidMount() {
  const navBar = ReactDOM.findDOMNode(this)
  const collapsibleNav = navBar.querySelector('div.navbar-collapse');
  const btnToggle = navBar.querySelector('button.navbar-toggle');



  navBar.addEventListener('click', (evt) => {
    if (evt.target.tagName !== 'A' || evt.target.classList.contains('dropdown-toggle') || ! collapsibleNav.classList.contains('in')) {
      return;
    }

    btnToggle.click();
  }, false);
}

  render() {
    const icon = (
      <span class="logo">
        <div>
          <img src="/favicon.ico" height="33" width="50" alt="text here" />
          SWIPEBITE
        </div>
      </span>
    );

    return (
    <Navbar inverse>
    <Navbar.Header>
      <Navbar.Brand>
        {icon}
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <NavItem eventKey={1} onClick={(event) => this.props.redirect(event.target.textContent)}>Swipe</NavItem>
        <NavItem eventKey={2} onClick={(event) => this.props.redirect(event.target.textContent)}>Cart</NavItem>
      </Nav>
      <Nav pullRight>
        <NavItem eventKey={1} onClick={(event) => this.props.redirect(event.target.textContent)}>Recipes</NavItem>
        <NavItem eventKey={2} onClick={(event) => this.props.redirect(event.target.textContent)}>Explore</NavItem>
        <NavItem eventKey={3} href="/foodBot/auth/logout"> Sign Out</NavItem>
      </Nav>
    </Navbar.Collapse>
    </Navbar>
    )
  }
}

export default Header;