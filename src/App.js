import React from "react";
import { Router, Link, Switch, Route } from "react-static";
import { hot } from "react-hot-loader";
import Routes from "react-static-routes";

import "./app.css";

const App = () => (
  <Router>
    <Switch>
      <Route
        render={() => (
          <div>
            <nav>
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/blog">Blog</Link>
            </nav>
            <div className="content">
              <Routes />
            </div>
          </div>
        )}
      />
    </Switch>
  </Router>
);

export default hot(module)(App);
