import React from "react";
import { WhyUnionize } from "../../pages/WhyUnionize";

const WhyUnionizePreview = ({ entry }) => (
  <WhyUnionize
    title={entry.getIn(["data", "title"])}
    text={entry.getIn(["data", "text"])}
  />
);

export default WhyUnionizePreview;
