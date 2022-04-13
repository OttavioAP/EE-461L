import React, { Component } from "react";
//import { Button } from "react-bootstrap";
import history from "./../history";
import { Navbar, Container, Nav, NavbarBrand } from "react-bootstrap";
import { NavLink } from "reactstrap";
import { NavLink as ReactLink } from "react-router-dom";

import { Button, Form, Table } from "react-bootstrap";

export default class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hwset1: 0,
      hwset2: 0,
      hwset1_availability: 0,
      hwset2_availability: 0,
      hwset1_checkout: 0,
      hwset2_checkout: 0,
    };
  }

  handleClick = async () => {
    await history.push({
      pathname: "/main",
    });
  };

  handlehwset1 = (hwset1) => {
    this.setState({ hwset1: hwset1 });
  };

  handlehwset2 = (hwset2) => {
    this.setState({ hwset2: hwset2 });
  };

  handlehw1checkin = async () => {
    const params = {
      projectid: this.props.location.state.project_id.$oid,
      amount: this.state.hwset1,
    };
    await fetch("/hw1checkin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Successfully checked in hwset 1!");
          this.getAvail();
        } else {
          alert("Checked in failed!");
        }
      });
  };

  handlehw1checkout = async () => {
    const params = {
      projectid: this.props.location.state.project_id.$oid,
      amount: this.state.hwset1,
    };
    await fetch("/hw1checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Successfully checked out hwset 1!");
          this.getAvail();
        } else {
          alert("Checked out failed!");
        }
      });
  };

  handlehw2checkin = async () => {
    const params = {
      projectid: this.props.location.state.project_id.$oid,
      amount: this.state.hwset2,
    };
    await fetch("/hw2checkin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Successfully checked in hwset 2!");
          this.getAvail();
        } else {
          alert("Checked in failed!");
        }
      });
  };

  handlehw2checkout = async () => {
    const params = {
      projectid: this.props.location.state.project_id.$oid,
      amount: this.state.hwset2,
    };
    await fetch("/hw2checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Successfully checked out hwset 2!");
          this.getAvail();
        } else {
          alert("Checked out failed!");
        }
      });
  };

  getAvail = async () => {
    await fetch("/getAvail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id: this.props.location.state.project_id.$oid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          hwset1_availability: data.avail1,
          hwset2_availability: data.avail2,
          hwset1_checkout: data.checkout1,
          hwset2_checkout: data.checkout2,
        });
      });
  };

  componentDidMount() {
    fetch("/getAvail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id: this.props.location.state.project_id.$oid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          hwset1_availability: data.avail1,
          hwset2_availability: data.avail2,
          hwset1_checkout: data.checkout1,
          hwset2_checkout: data.checkout2,
        });
      });
  }

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

        <div className="checkout">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>HWSet1 Availability</th>
                <th>HWSet2 Availability</th>
              </tr>
            </thead>
            <tbody>
              <td>{this.state.hwset1_availability}</td>
              <td>{this.state.hwset2_availability}</td>
            </tbody>
          </Table>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Current HWSet1 Allocation for this project</th>
                <th>Current HWSet2 Allocation for this project</th>
              </tr>
            </thead>
            <tbody>
              <td>{this.state.hwset1_checkout}</td>
              <td>{this.state.hwset2_checkout}</td>
            </tbody>
          </Table>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>HWSET1 </Form.Label>
              <Form.Control
                placeholder="Enter # of HWSET1 to check in or check out"
                name="hwset1"
                onChange={(e) => {
                  this.handlehwset1(e.target.value);
                }}
              />
              <Button onClick={this.handlehw1checkin}>Check In</Button>
              <br />
              <Button onClick={this.handlehw1checkout}>Check Out</Button>
            </Form.Group>
            <br />
            <Form.Group className="mb-3">
              <Form.Label>HWSET2</Form.Label>
              <Form.Control
                placeholder="Enter # of HWSET2 to check in or check out"
                name="hwset2"
                onChange={(e) => {
                  this.handlehwset2(e.target.value);
                }}
              />
              <Button onClick={this.handlehw2checkin}>Check In</Button>
              <br />
              <Button onClick={this.handlehw2checkout}>Check Out</Button>
            </Form.Group>
          </Form>
        </div>
        <Button onClick={this.handleClick}>Back to Main Page</Button>
      </div>
    );
  }
}
