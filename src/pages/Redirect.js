import React from "react";
import { Redirect, withSiteData } from "react-static";

export default withSiteData(siteData => {
  // Default to English
  let lang = "en";
  // If we're in a browser context...
  if (typeof document !== "undefined") {
    // ...try from cookies first.
    const langFromCookie = document.cookie.replace(
      /(?:(?:^|.*;\s*)lang\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (langFromCookie in siteData) {
      lang = langFromCookie;
    } else if (typeof navigator !== "undefined") {
      // Otherwise, try to grab it from the navigator.
      const langFromNavigator = navigator.language.split("-")[0];
      if (langFromNavigator in siteData) {
        lang = langFromNavigator;
      }
    }
  }

  return <Redirect to={`/${lang}`} />;
});
