import React, { Component } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { Navbar, Container, Nav, NavbarBrand } from "react-bootstrap";
import { NavLink } from "reactstrap";
import { NavLink as ReactLink } from "react-router-dom";
import history from "./../history";

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectname: "",
      projectdescription: "",
      projectID: 0,
      existingProjects: [],
    };
  }

  handleProjectName(projectname) {
    this.setState({ projectname: projectname });
  }

  handleDescription(projectdescription) {
    this.setState({ projectdescription: projectdescription });
  }

  handleID(projectID) {
    this.setState({ projectID: projectID });
  }

  handleCreateProject = async () => {
    const params = {
      projectname: this.state.projectname,
      projectdescription: this.state.projectdescription,
      projectID: this.state.projectID,
    };
    await fetch("/createproject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Successfully created the project!!");
        }
      });
  };

  handleShowProject = async () => {
    await fetch("/getAllProjects", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ existingProjects: data.projects });
        console.log(this.state.existingProjects);
      });
  };

  handleJoin = async (id) => {
    await history.push({
      pathname: "/projects",
      state: { project_id: id },
    });
  };

  render() {
    return (
      <div className="MainPage">
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

        <h2 style={{ textAlign: "center" }}>Create New Project</h2>
        <div className="Main">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Project Name </Form.Label>
              <Form.Control
                placeholder="Enter Project name"
                name="projectname"
                onChange={(e) => {
                  this.handleProjectName(e.target.value);
                }}
              />
            </Form.Group>
            <br />
            <Form.Group className="mb-3">
              <Form.Label>Description </Form.Label>
              <Form.Control
                placeholder="Enter project description"
                name="projectdescription"
                onChange={(e) => {
                  this.handleDescription(e.target.value);
                }}
              />
            </Form.Group>
            <br />
            <Form.Group className="mb-3">
              <Form.Label>Project ID </Form.Label>
              <Form.Control
                placeholder="Enter project ID"
                name="projectID"
                onChange={(e) => {
                  this.handleID(e.target.value);
                }}
              />
            </Form.Group>
          </Form>
          <br />
          <Button variant="primary" onClick={this.handleCreateProject}>
            Create
          </Button>
          <Button variant="primary" onClick={this.handleShowProject}>
            Show Existing Project
          </Button>
          <br />
          <Form.Text className="text-muted">
            Note: User can create a new project.
          </Form.Text>
        </div>
        <br />
        <h2>Existing Project</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Project Name</th>
              <th>Project Description</th>
              <th>HWSet #1</th>
              <th>HWSet #2</th>
              <th>Join the project</th>
            </tr>
          </thead>
          <tbody>
            {this.state.existingProjects.map((listValue, index) => {
              return (
                <tr key={index}>
                  <td>{listValue.projectID}</td>
                  <td>{listValue.projectname}</td>
                  <td>{listValue.projectdescription}</td>
                  <td>{listValue.hwset1}</td>
                  <td>{listValue.hwset2}</td>
                  <td>
                    <Button onClick={this.handleJoin.bind(this, listValue._id)}>
                      Join
                    </Button>
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
