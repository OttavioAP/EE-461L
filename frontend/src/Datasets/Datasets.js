import React, { Component } from "react";
import { Navbar, Container, Nav, NavbarBrand } from "react-bootstrap";
import { NavLink } from "reactstrap";
import { NavLink as ReactLink } from "react-router-dom";
import history from "./../history";
import { Button, Form, Table } from "react-bootstrap";

export default class Datasets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
    };
  }

  componentDidMount() {
    fetch("/getDatasets", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ datasets: data.datasets });
      });
  }

  render() {
    console.log("here", this.state.datasets);
    return (
      <div className="Datasets">
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
        <h1>Datasets page</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Dataset Name</th>
              <th>Dataset Metadata</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {this.state.datasets.map((listValue, index) => {
              return (
                <tr key={index}>
                  <td>{listValue.name}</td>
                  <td>{listValue.metadata}</td>
                  <td>
                    <a href={listValue.url}>Download Dataset</a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}
