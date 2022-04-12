import React, { Component } from "react";
import { Button } from "react-bootstrap";
import history from "./../history";
import { Navbar, Container, Nav, NavbarBrand } from "react-bootstrap";
import { NavLink } from "reactstrap";
import { NavLink as ReactLink } from "react-router-dom";

export default class Projects extends Component {
  handleClick = async () => {
    await history.push({
      pathname: "/main",
    });
  };

  render() {
    return (
      <div className="Projects">
        <Navbar bg="dark" variant="dark">
          <Container>
            <NavbarBrand>Menu</NavbarBrand>
            <Nav className="me-auto">
              <NavLink tag={ReactLink} to="/main">
                Main
              </NavLink>
              <NavLink tag={ReactLink} to="/datasets">
                Datasets
              </NavLink>
              <NavLink tag={ReactLink} to="/login">
                Log out
              </NavLink>
            </Nav>
          </Container>
        </Navbar>
        <h1>Projects page</h1>
        <p>A simple app showing react button click navigation</p>
        {console.log(this.props.location.state)}
        <Button onClick={this.handleClick}>Back to Main Page</Button>
      </div>
    );
  }
}
