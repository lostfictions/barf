import React from "react";
import {
  Router,
  Link,
  Switch,
  Route,
  Head,
  withSiteData,
  withRouter
} from "react-static";
import { hot } from "react-hot-loader";
import Routes from "react-static-routes";

import "./app.css";

const App = withSiteData(siteData => {
  const langs = Object.keys(siteData.languageData);
  return (
    <Router>
      <div>
        <Route
          path="/:lang/:path?"
          render={({ match: { params } }) => {
            return (
              <nav>
                {langs.map((lang, i) => (
                  <Link
                    key={i}
                    to={`/${lang}${params.path ? `/${params.path}` : ""}`}
                  >
                    {lang.toUpperCase()}
                  </Link>
                ))}
              </nav>
            );
          }}
        />
        <div className="content">
          <Routes />
        </div>
      </div>
      )} />
    </Router>
  );
});

export default hot(module)(App);
