import React from "react";
import history from "./../history";
import "./Login.css";
import { Button, Form, Navbar, Container } from "react-bootstrap";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  handleUserName(name) {
    this.setState({ username: name });
  }

  handlePassword(password) {
    this.setState({ password: password });
  }

  handleLogin = async () => {
    const params = {
      username: this.state.username,
      password: this.state.password,
    };
    await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          history.push("/main");
        } else {
          alert(data.msg);
        }
      });
  };

  // send username and password as request body
  handleRegister = async () => {
    const params = {
      username: this.state.username,
      password: this.state.password,
    };
    await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success == true) {
          alert(
            "Please log in with your registered username and password to enter the application!"
          );
        } else {
          alert("Something is wrong!");
        }
      });
  };

  render() {
    return (
      <div>
        <Navbar bg="dark">
          <Container>
            <Navbar.Brand>
              Welcome to Our Project Management Website!
            </Navbar.Brand>
          </Container>
        </Navbar>
        <div className="Login">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username </Form.Label>
              <Form.Control
                placeholder="Enter username"
                name="username"
                onChange={(e) => {
                  this.handleUserName(e.target.value);
                }}
              />
            </Form.Group>
            <br />
            <Form.Group className="mb-3">
              <Form.Label>Password </Form.Label>
              <Form.Control
                placeholder="Enter password"
                name="password"
                onChange={(e) => {
                  this.handlePassword(e.target.value);
                }}
              />
            </Form.Group>
          </Form>
          <br />
          <Button variant="primary" onClick={this.handleLogin}>
            Log in
          </Button>
          <Button variant="secondary" onClick={this.handleRegister}>
            Register
          </Button>
          <br />
          <Form.Text className="text-muted">
            Note: User needs to log in to the application. If user has not
            registered before, they should register first and then log in.
          </Form.Text>
        </div>
      </div>
    );
  }
}

export default Login;
