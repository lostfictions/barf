import React from "react";

import {
  withRouteData
  // Link
} from "react-static";
import Markdown from "react-markdown";

export default withRouteData(({ copy }) => (
  <div>
    <Markdown source={copy} escapeHtml={false} />
  </div>
));
