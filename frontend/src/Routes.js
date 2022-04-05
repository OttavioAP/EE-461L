import React, { Component } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import history from "./history";
import Main from "./Main/Main";
import Projects from "./Projects/Projects";
import Datasets from "./Datasets/Datasets";
import Login from "./Login/Login";

export default class MyRoutes extends Component {
  render() {
    return (
      //eslint-disable-next-line
      <Router history={history}>
        <Switch>
          <Redirect exact from="/" to="/login" />
          <Route exact path="/login" component={Login} />
          <Route exact path="/main" component={Main} />
          <Route exact path="/projects" component={Projects} />
          <Route exact path="/datasets" component={Datasets} />
        </Switch>
      </Router>
    );
  }
}
