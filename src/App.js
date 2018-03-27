import React from "react";
import { Router, Link, Switch, Route, Head } from "react-static";
import { hot } from "react-hot-loader";
import Routes from "react-static-routes";

import "./app.css";

const App = () => (
  <Router>
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/why-unionize">Why Unionize?</Link>
      </nav>
      <nav>
        <Link to="/en">EN</Link>
        <Link to="/fr">FR</Link>
      </nav>

      <div className="content">
        <Routes />
      </div>
    </div>
    )} />
  </Router>
);

export default hot(module)(App);
